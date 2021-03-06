/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const Compiler = require("./Compiler");
const WebEnvironmentPlugin = require("./web/WebEnvironmentPlugin");
const WebpackOptionsApply = require("./WebpackOptionsApply");
const WebpackOptionsDefaulter = require("./WebpackOptionsDefaulter");

function webpack(options, callback) {
	new WebpackOptionsDefaulter().process(options);

	const compiler = new Compiler();
	compiler.options = options;
	compiler.options = new WebpackOptionsApply().process(options, compiler);
	new WebEnvironmentPlugin(options.inputFileSystem, options.outputFileSystem).apply(compiler);
	if(callback) {
		compiler.run(callback);
	}
	return compiler;
}
module.exports = webpack;

webpack.WebpackOptionsDefaulter = WebpackOptionsDefaulter;
webpack.WebpackOptionsApply = WebpackOptionsApply;
webpack.Compiler = Compiler;
webpack.WebEnvironmentPlugin = WebEnvironmentPlugin;
