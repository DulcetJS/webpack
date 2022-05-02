/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const ModuleDependency = require("./ModuleDependency");

class LoaderDependency extends ModuleDependency {
	constructor(request) {
		super(request);
	}

	get type() {
		return "loader";
	}
}

module.exports = LoaderDependency;
