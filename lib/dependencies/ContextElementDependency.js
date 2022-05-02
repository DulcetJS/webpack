/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";
const ModuleDependency = require("./ModuleDependency");

class ContextElementDependency extends ModuleDependency {
	constructor(request, userRequest) {
		super(request);
		if(userRequest) {
			this.userRequest = userRequest;
		}
	}

	get type() {
		return "context element";
	}
}

module.exports = ContextElementDependency;
