/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const WebpackError = require("../WebpackError");

module.exports = class NoAsyncChunksWarning extends WebpackError {
	constructor() {
		super();

		this.name = "NoAsyncChunksWarning";
		this.message = "webpack performance recommendations: \n" +
			"You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.\n" +
			"For more info visit https://webpack.js.org/guides/code-splitting/";

		Error.captureStackTrace(this, this.constructor);
	}
};
