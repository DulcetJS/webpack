/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const Dependency = require("../Dependency");

class ModuleDependency extends Dependency {
	constructor(request) {
		super();
		this.request = request;
		this.userRequest = request;
	}

	isEqualResource(other) {
		if(!(other instanceof ModuleDependency))
			return false;

		return this.request === other.request;
	}
}

module.exports = ModuleDependency;
