/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

module.exports = class ModuleReason {
	constructor(module, dependency) {
		this.module = module;
		this.dependency = dependency;
	}
};
