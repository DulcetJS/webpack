/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class UnsupportedFeatureWarning extends Error {

	constructor(module, message) {
		super();
		if(Error.hasOwnProperty("captureStackTrace")) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.name = "UnsupportedFeatureWarning";
		this.message = message;
		this.origin = this.module = module;
	}
}

module.exports = UnsupportedFeatureWarning;
