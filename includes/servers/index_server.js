var restify = require('restify');

var index = restify.serveStatic({
    directory: './public',
    file: 'index.html'
});

module.exports = index;