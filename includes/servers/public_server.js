var restify = require('restify');
var rfr = require('rfr');
var path = require('path');

var server = restify.serveStatic({
	directory: path.join(rfr.root, '/public/')
});

module.exports = server;