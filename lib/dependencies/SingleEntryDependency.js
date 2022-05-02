/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const ModuleDependency = require("./ModuleDependency");

class SingleEntryDependency extends ModuleDependency {
	constructor(request) {
		super(request);
	}

	get type() {
		return "single entry";
	}
}

module.exports = SingleEntryDependency;
