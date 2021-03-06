/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const Dependency = require("../Dependency");

class NullDependency extends Dependency {
	get type() {
		return "null";
	}

	isEqualResource() {
		return false;
	}

	updateHash() {}
}

NullDependency.Template = class NullDependencyTemplate {
	apply() {}
};

module.exports = NullDependency;
