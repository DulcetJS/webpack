/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

module.exports = class WebpackError extends Error {
	inspect() {
		return this.stack + (this.details ? `\n${this.details}` : "");
	}
};
