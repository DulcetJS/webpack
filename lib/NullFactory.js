/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

class NullFactory {
	create(data, callback) {
		return callback();
	}
}
module.exports = NullFactory;
