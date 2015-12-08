var restify = require('restify');

var server = restify.serveStatic({
	directory: './public'
});

module.exports = server;