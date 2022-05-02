/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const ModuleDependency = require("./ModuleDependency");

class DelegatedSourceDependency extends ModuleDependency {
	constructor(request) {
		super(request);
	}

	get type() {
		return "delegated source";
	}
}

module.exports = DelegatedSourceDependency;
