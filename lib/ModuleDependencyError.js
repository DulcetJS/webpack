/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const formatLocation = require("./formatLocation");

module.exports = class ModuleDependencyError extends Error {
	constructor(module, err, loc) {
		super();

		if(Error.hasOwnProperty("captureStackTrace")) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.name = "ModuleDependencyError";

		this.message = `${formatLocation(loc)} ${err.message}`;
		this.details = err.stack.split("\n").slice(1).join("\n");
		this.origin = this.module = module;
		this.error = err;
	}
};