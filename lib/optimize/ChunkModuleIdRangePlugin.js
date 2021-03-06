/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
class ChunkModuleIdRangePlugin {
	constructor(options) {
		this.options = options;
	}
	apply(compiler) {
		const options = this.options;
		compiler.plugin("compilation", (compilation) => {
			compilation.plugin("module-ids", (modules) => {
				const chunk = this.chunks.find((chunk) => chunk.name === options.name);
				if(!chunk) throw new Error("ChunkModuleIdRangePlugin: Chunk with name '" + options.name + "' was not found");
				let currentId = options.start;
				let chunkModules;
				if(options.order) {
					chunkModules = chunk.modules.slice();
					switch(options.order) {
						case "index":
							chunkModules.sort((a, b) => {
								return a.index - b.index;
							});
							break;
						case "index2":
							chunkModules.sort((a, b) => {
								return a.index2 - b.index2;
							});
							break;
						default:
							throw new Error("ChunkModuleIdRangePlugin: unexpected value of order");
					}

				} else {
					chunkModules = modules.filter((m) => {
						return m.chunks.indexOf(chunk) >= 0;
					});
				}

				for(let i = 0; i < chunkModules.length; i++) {
					const m = chunkModules[i];
					if(m.id === null) {
						m.id = currentId++;
					}
					if(options.end && currentId > options.end)
						break;
				}
			});
		});
	}
}
module.exports = ChunkModuleIdRangePlugin;
