/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class DedupePlugin {
	apply(compiler) {
		compiler.plugin("compilation", (compilation) => {
			compilation.warnings.push(new Error("DedupePlugin: This plugin was removed from webpack. remove it from configuration."));
		});
	}
}

module.exports = DedupePlugin;
