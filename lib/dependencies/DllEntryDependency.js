/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const Dependency = require("../Dependency");

class DllEntryDependency extends Dependency {
	constructor(dependencies, name) {
		super();
		this.dependencies = dependencies;
		this.name = name;
	}

	get type() {
		return "dll entry";
	}
}

module.exports = DllEntryDependency;
