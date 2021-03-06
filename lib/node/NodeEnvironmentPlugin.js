/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const NodeWatchFileSystem = require("./NodeWatchFileSystem");
const NodeOutputFileSystem = require("./NodeOutputFileSystem");
const NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");

class NodeEnvironmentPlugin {
	apply(compiler) {
		compiler.inputFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000);
		const inputFileSystem = compiler.inputFileSystem;
		compiler.outputFileSystem = new NodeOutputFileSystem();
		compiler.watchFileSystem = new NodeWatchFileSystem(compiler.inputFileSystem);
		compiler.plugin("before-run", (compiler, callback) => {
			if(compiler.inputFileSystem === inputFileSystem)
				inputFileSystem.purge();
			callback();
		});
	}
}
module.exports = NodeEnvironmentPlugin;
