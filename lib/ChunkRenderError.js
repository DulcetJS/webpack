/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class ChunkRenderError extends Error {

	constructor(chunk, file, error) {
		super();

		if(Error.hasOwnProperty("captureStackTrace")) {
			Error.captureStackTrace(this, this.constructor);
		}

		this.name = "ChunkRenderError";
		this.error = error;
		this.message = error.message;
		this.details = error.stack;
		this.file = file;
		this.chunk = chunk;
	}
}

module.exports = ChunkRenderError;