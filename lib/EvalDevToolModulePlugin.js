/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const EvalDevToolModuleTemplatePlugin = require("./EvalDevToolModuleTemplatePlugin");

class EvalDevToolModulePlugin {
	constructor(sourceUrlComment, moduleFilenameTemplate) {
		this.sourceUrlComment = sourceUrlComment;
		this.moduleFilenameTemplate = moduleFilenameTemplate;
	}

	apply(compiler) {
		compiler.plugin("compilation", (compilation) => {
			compilation.moduleTemplate.apply(new EvalDevToolModuleTemplatePlugin(this.sourceUrlComment, this.moduleFilenameTemplate));
		});
	}
}

module.exports = EvalDevToolModulePlugin;
