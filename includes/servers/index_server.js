var restify = require('restify');


function serveIndex(opts) {
	var indexFile = opts.indexFile || 'index.html';
	var indexDirectory = opts.indexDirectory || './public';

	var index = restify.plugins.serveStatic({
		directory: indexDirectory,
		file: indexFile
	});

	return index;
}

module.exports = serveIndex;