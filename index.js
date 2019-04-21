var CookieParser = require('restify-cookies');
var restify = require('restify');
var rfr = require('rfr');
var db = rfr('includes/models');
var routes = rfr('includes/routes');
var servers = rfr('includes/servers');
var pages = rfr('config/pages.json');
var config = rfr('includes/config.js');
var path = require('path');

var startServer = function(options, callback) {
	options = options || {};

	var server = restify.createServer({
		name: 'DimeShift',
	});

	// Server settings
	server.pre(restify.pre.sanitizePath());
	server.on('uncaughtException', function(req, res, route, err) {
		try {
			res.json(500, err);
		} catch (e) {
			res.end();
		}
		return true;
	});
	db.Sequelize.Promise.onPossiblyUnhandledRejection(function(reason) {
		throw reason;
	});
	server.use(CookieParser.parse);
	server.use(restify.plugins.queryParser());
	server.use(restify.plugins.bodyParser());

	// API routes
	routes(function(routes) {
		routes.forEach(function(route) {
			server[route.method](route.route, route.handler);
		});
	});

	// Templates
	var templatesDirectory = path.join(rfr.root, './public');
	server.get('/jstemplates/*', servers.static_file_server({
		directory: templatesDirectory,
		suffix: '.tpl'
	}));

	// Static files and css/js minification
	server.get('/images/*', servers.images_server());
	server.get('/scripts/*', servers.public_server);
	server.get('/vendors/*', servers.public_server);
	server.get('/resources/js.js', servers.minify_server('javascript'));
	server.get('/css.css', servers.minify_server('css'));

	// App index html file
	for (var k in pages) {
		server.get(k, servers.index_server({
			indexFile: options.indexFile,
			indexDirectory: options.indexDirectory
		}));
	}

	// Sync db and start server
	db.sequelize.sync()
		.then(function(err) {
			var port = config.port || process.env.PORT || 8080;
			var doStart = function(selectedPort) {
				server.listen(selectedPort);
				console.log("Server started: http://localhost:" + selectedPort + "/");
				if (typeof(callback) === 'function')
					callback(selectedPort);
			}

			if (typeof(port) === 'function')
				port(doStart);
			else
				doStart(port);
		});
};

if (!module.parent) {
	startServer();
} else {
	module.exports = startServer;
}