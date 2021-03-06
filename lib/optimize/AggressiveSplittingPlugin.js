/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const identifierUtils = require("../util/identifier");

function moveModuleBetween(oldChunk, newChunk) {
	return function(module) {
		oldChunk.moveModule(module, newChunk);
	};
}

function isNotAEntryModule(entryModule) {
	return function(module) {
		return entryModule !== module;
	};
}

function copyWithReason(obj) {
	const newObj = {};
	Object.keys(obj).forEach((key) => {
		newObj[key] = obj[key];
	});
	if(!newObj.reasons || newObj.reasons.indexOf("aggressive-splitted") < 0)
		newObj.reasons = (newObj.reasons || []).concat("aggressive-splitted");
	return newObj;
}

class AggressiveSplittingPlugin {
	constructor(options) {
		this.options = options || {};
		if(typeof this.options.minSize !== "number") this.options.minSize = 30 * 1024;
		if(typeof this.options.maxSize !== "number") this.options.maxSize = 50 * 1024;
		if(typeof this.options.chunkOverhead !== "number") this.options.chunkOverhead = 0;
		if(typeof this.options.entryChunkMultiplicator !== "number") this.options.entryChunkMultiplicator = 1;
	}
	apply(compiler) {
		compiler.plugin("this-compilation", (compilation) => {
			compilation.plugin("optimize-chunks-advanced", (chunks) => {
				// Precompute stuff
				const nameToModuleMap = new Map();
				compilation.modules.forEach(m => {
					const name = identifierUtils.makePathsRelative(compiler.context, m.identifier(), compilation.cache);
					nameToModuleMap.set(name, m);
				});

				const savedSplits = compilation.records && compilation.records.aggressiveSplits || [];
				const usedSplits = compilation._aggressiveSplittingSplits ?
					savedSplits.concat(compilation._aggressiveSplittingSplits) : savedSplits;

				const minSize = this.options.minSize;
				const maxSize = this.options.maxSize;
				// 1. try to restore to recorded splitting
				for(let j = 0; j < usedSplits.length; j++) {
					const splitData = usedSplits[j];
					const selectedModules = splitData.modules.map(name => nameToModuleMap.get(name));

					// Does the modules exist at all?
					if(selectedModules.every(Boolean)) {

						// Find all chunks containing all modules in the split
						for(let i = 0; i < chunks.length; i++) {
							const chunk = chunks[i];

							// Cheap check if chunk is suitable at all
							if(chunk.getNumberOfModules() < splitData.modules.length)
								continue;

							// Check if all modules are in the chunk
							if(selectedModules.every(m => chunk.containsModule(m))) {

								// Is chunk identical to the split or do we need to split it?
								if(chunk.getNumberOfModules() > splitData.modules.length) {
									// split the chunk into two parts
									const newChunk = compilation.addChunk();
									selectedModules.forEach(moveModuleBetween(chunk, newChunk));
									chunk.split(newChunk);
									chunk.name = null;
									newChunk._fromAggressiveSplitting = true;
									if(j < savedSplits.length)
										newChunk._fromAggressiveSplittingIndex = j;
									if(splitData.id !== null && splitData.id !== undefined) {
										newChunk.id = splitData.id;
									}
									newChunk.origins = chunk.origins.map(copyWithReason);
									chunk.origins = chunk.origins.map(copyWithReason);
									return true;
								} else { // chunk is identical to the split
									if(j < savedSplits.length)
										chunk._fromAggressiveSplittingIndex = j;
									chunk.name = null;
									if(splitData.id !== null && splitData.id !== undefined) {
										chunk.id = splitData.id;
									}
								}
							}
						}
					}
				}

				// 2. for any other chunk which isn't splitted yet, split it
				for(let i = 0; i < chunks.length; i++) {
					const chunk = chunks[i];
					const size = chunk.size(this.options);
					if(size > maxSize && chunk.getNumberOfModules() > 1) {
						const newChunk = compilation.addChunk();
						const modules = chunk.getModules()
							.filter(isNotAEntryModule(chunk.entryModule))
							.sort((a, b) => {
								a = a.identifier();
								b = b.identifier();
								if(a > b) return 1;
								if(a < b) return -1;
								return 0;
							});
						for(let k = 0; k < modules.length; k++) {
							chunk.moveModule(modules[k], newChunk);
							const newSize = newChunk.size(this.options);
							const chunkSize = chunk.size(this.options);
							// break early if it's fine
							if(chunkSize < maxSize && newSize < maxSize && newSize >= minSize && chunkSize >= minSize)
								break;
							if(newSize > maxSize && k === 0) {
								// break if there is a single module which is bigger than maxSize
								break;
							}
							if(newSize > maxSize || chunkSize < minSize) {
								// move it back
								newChunk.moveModule(modules[k], chunk);
								// check if it's fine now
								if(newSize < maxSize && newSize >= minSize && chunkSize >= minSize)
									break;
							}
						}
						if(newChunk.getNumberOfModules() > 0) {
							chunk.split(newChunk);
							chunk.name = null;
							newChunk.origins = chunk.origins.map(copyWithReason);
							chunk.origins = chunk.origins.map(copyWithReason);
							compilation._aggressiveSplittingSplits = (compilation._aggressiveSplittingSplits || []).concat({
								modules: newChunk.mapModules(m => identifierUtils.makePathsRelative(compiler.context, m.identifier(), compilation.cache))
							});
							return true;
						} else {
							chunks.splice(chunks.indexOf(newChunk), 1);
						}
					}
				}
			});
			compilation.plugin("record-hash", (records) => {
				// 3. save to made splittings to records
				const minSize = this.options.minSize;
				if(!records.aggressiveSplits) records.aggressiveSplits = [];
				compilation.chunks.forEach((chunk) => {
					if(chunk.hasEntryModule()) return;
					const size = chunk.size(this.options);
					const incorrectSize = size < minSize;
					const modules = chunk.mapModules(m => identifierUtils.makePathsRelative(compiler.context, m.identifier(), compilation.cache));
					if(typeof chunk._fromAggressiveSplittingIndex === "undefined") {
						if(incorrectSize) return;
						chunk.recorded = true;
						records.aggressiveSplits.push({
							modules: modules,
							hash: chunk.hash,
							id: chunk.id
						});
					} else {
						const splitData = records.aggressiveSplits[chunk._fromAggressiveSplittingIndex];
						if(splitData.hash !== chunk.hash || incorrectSize) {
							if(chunk._fromAggressiveSplitting) {
								chunk._aggressiveSplittingInvalid = true;
								splitData.invalid = true;
							} else {
								splitData.hash = chunk.hash;
							}
						}
					}
				});
				records.aggressiveSplits = records.aggressiveSplits.filter((splitData) => {
					return !splitData.invalid;
				});
			});
			compilation.plugin("need-additional-seal", (callback) => {
				const invalid = compilation.chunks.some((chunk) => {
					return chunk._aggressiveSplittingInvalid;
				});
				if(invalid)
					return true;
			});
		});
	}
}
module.exports = AggressiveSplittingPlugin;
