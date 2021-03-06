/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/
/*globals hotAddUpdateChunk parentHotUpdateCallback document XMLHttpRequest $require$ $hotChunkFilename$ $hotMainFilename$ */
module.exports = function() {
	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
		hotAddUpdateChunk(chunkId, moreModules);
		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
	} //$semicolon

	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.charset = "utf-8";
		script.src = $require$.p + $hotChunkFilename$;
		head.appendChild(script);
	}

	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
		requestTimeout = requestTimeout || 10000;
		return new Promise(function(resolve, reject) {
			if(typeof XMLHttpRequest === "undefined")
				return reject(new Error("No browser support"));
			try {
				var request = new XMLHttpRequest();
				var requestPath = $require$.p + $hotMainFilename$;
				request.open("GET", requestPath, true);
				request.timeout = requestTimeout;
				request.send(null);
			} catch(err) {
				return reject(err);
			}
			request.onreadystatechange = function() {
				if(request.readyState !== 4) return;
				if(request.status === 0) {
					// timeout
					reject(new Error("Manifest request to " + requestPath + " timed out."));
				} else if(request.status === 404) {
					// no update available
					resolve();
				} else if(request.status !== 200 && request.status !== 304) {
					// other failure
					reject(new Error("Manifest request to " + requestPath + " failed."));
				} else {
					// success
					try {
						var update = JSON.parse(request.responseText);
					} catch(e) {
						reject(e);
						return;
					}
					resolve(update);
				}
			};
		});
	}
};
