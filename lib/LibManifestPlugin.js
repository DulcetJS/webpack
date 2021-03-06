/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const path = require("path");
const asyncLib = require("async");

class LibManifestPlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.plugin("emit", (compilation, callback) => {
			asyncLib.forEach(compilation.chunks, (chunk, callback) => {
				if(!chunk.isInitial()) {
					callback();
					return;
				}
				const targetPath = compilation.getPath(this.options.path, {
					hash: compilation.hash,
					chunk
				});
				const name = this.options.name && compilation.getPath(this.options.name, {
					hash: compilation.hash,
					chunk
				});
				const manifest = {
					name,
					type: this.options.type,
					content: chunk.mapModules(module => {
						if(module.libIdent) {
							const ident = module.libIdent({
								context: this.options.context || compiler.options.context
							});
							if(ident) {
								return {
									ident,
									data: {
										id: module.id,
										meta: module.meta,
										exports: Array.isArray(module.providedExports) ? module.providedExports : undefined
									}
								};
							}
						}
					}).filter(Boolean).reduce((obj, item) => {
						obj[item.ident] = item.data;
						return obj;
					}, Object.create(null))
				};
				const content = new Buffer(JSON.stringify(manifest), "utf8"); //eslint-disable-line
				compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
					if(err) return callback(err);
					compiler.outputFileSystem.writeFile(targetPath, content, callback);
				});
			}, callback);
		});
	}
}
module.exports = LibManifestPlugin;
