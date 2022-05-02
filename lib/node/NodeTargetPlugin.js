/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const ExternalsPlugin = require("../ExternalsPlugin");

class NodeTargetPlugin {
	apply(compiler) {
		new ExternalsPlugin("commonjs", Object.keys(process.binding("natives"))).apply(compiler);
	}
}

module.exports = NodeTargetPlugin;
