/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class ModuleWarning extends Error {
	constructor(module, warning) {
		super();

		if(Error.hasOwnProperty("captureStackTrace")) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.name = "ModuleWarning";
		this.module = module;
		this.message = warning;
		this.warning = warning;
	}
}

module.exports = ModuleWarning;
