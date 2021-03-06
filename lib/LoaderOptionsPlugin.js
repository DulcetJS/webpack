/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const ModuleFilenameHelpers = require("./ModuleFilenameHelpers");

class LoaderOptionsPlugin {
	constructor(options) {
		if(typeof options !== "object") options = {};
		if(!options.test) options.test = {
			test: () => true
		};
		this.options = options;
	}

	apply(compiler) {
		const options = this.options;
		compiler.plugin("compilation", (compilation) => {
			compilation.plugin("normal-module-loader", (context, module) => {
				const resource = module.resource;
				if(!resource) return;
				const i = resource.indexOf("?");
				if(ModuleFilenameHelpers.matchObject(options, i < 0 ? resource : resource.substr(0, i))) {
					const filterSet = new Set(["include", "exclude", "test"]);
					Object.keys(options)
						.filter((key) => !filterSet.has(key))
						.forEach((key) => context[key] = options[key]);
				}
			});
		});
	}
}

module.exports = LoaderOptionsPlugin;
