/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class ModuleError extends Error {

	constructor(module, err) {
		super();
		if(Error.hasOwnProperty("captureStackTrace")) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.name = "ModuleError";
		this.module = module;
		this.message = err;
		this.error = err;
	}
}

module.exports = ModuleError;
