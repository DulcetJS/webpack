/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

const MultiEntryDependency = require("./dependencies/MultiEntryDependency");
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");
const MultiModuleFactory = require("./MultiModuleFactory");
const MultiEntryPlugin = require("./MultiEntryPlugin");
const SingleEntryPlugin = require("./SingleEntryPlugin");

class DynamicEntryPlugin {
	constructor(context, entry) {
		this.context = context;
		this.entry = entry;
	}

	apply(compiler) {
		compiler.plugin("compilation", (compilation, params) => {
			const multiModuleFactory = new MultiModuleFactory();
			const normalModuleFactory = params.normalModuleFactory;

			compilation.dependencyFactories.set(MultiEntryDependency, multiModuleFactory);
			compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
		});

		compiler.plugin("make", (compilation, callback) => {
			const addEntry = (entry, name) => {
				const dep = DynamicEntryPlugin.createDependency(entry, name);
				return new Promise((resolve, reject) => {
					compilation.addEntry(this.context, dep, name, (err) => {
						if(err) return reject(err);
						resolve();
					});
				});
			};

			Promise.resolve(this.entry()).then((entry) => {
				if(typeof entry === "string" || Array.isArray(entry)) {
					addEntry(entry, "main").then(() => callback(), callback);
				} else if(typeof entry === "object") {
					Promise.all(Object.keys(entry).map((name) => {
						return addEntry(entry[name], name);
					})).then(() => callback(), callback);
				}
			});
		});
	}
}

module.exports = DynamicEntryPlugin;

DynamicEntryPlugin.createDependency = function(entry, name) {
	if(Array.isArray(entry))
		return MultiEntryPlugin.createDependency(entry, name);
	else
		return SingleEntryPlugin.createDependency(entry, name);
};
