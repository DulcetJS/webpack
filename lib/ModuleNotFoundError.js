/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
function ModuleNotFoundError(module, err, dependencies) {
	Error.call(this);
	Error.captureStackTrace(this, ModuleNotFoundError);
	this.name = "ModuleNotFoundError";
	this.message = "Module not found: " + err;
	this.details = err.details;
	this.missing = err.missing;
	this.module = module;
	this.origin = module;
	this.dependencies = dependencies;
	this.error = err;
}
module.exports = ModuleNotFoundError;

ModuleNotFoundError.prototype = Object.create(Error.prototype);
ModuleNotFoundError.prototype.constructor = ModuleNotFoundError;
