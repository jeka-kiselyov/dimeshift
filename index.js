var CookieParser = require('restify-cookies');
var restify = require('restify');
var rfr = require('rfr');
var db = rfr('includes/models');
var routes = rfr('includes/routes');
var servers = rfr('includes/servers');
var pages = rfr('config/pages.json');
var config = rfr('includes/config.js');

var startServer = function(callback) {
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
	server.use(restify.queryParser());
	server.use(restify.bodyParser());

	// API routes
	routes(function(routes) {
		routes.forEach(function(route) {
			server[route.method](route.route, route.handler);
		});
	});

	// Templates
	server.get(/jstemplates\/?.*/, servers.static_file_server({
		directory: './public',
		suffix: '.tpl'
	}));

	// Static files and css/js minification
	server.get(/images\/?.*/, servers.images_server());
	server.get(/\/scripts\/?.*/, servers.public_server);
	server.get(/\/vendors\/?.*/, servers.public_server);
	server.get('/resources/js.js', servers.minify_server('javascript'));
	server.get('/resources/css.css', servers.minify_server('css'));

	// App index html file
	for (var k in pages) {
		server.get(k, servers.index_server);
	}

	// Sync db and start server
	db.sequelize.sync()
		.then(function(err) {
			var port = config.port || process.env.PORT || 8080;
			server.listen(port);
			console.log("Server started: http://localhost:" + port + "/");
			if (typeof(callback) === 'function')
				callback();
		});
};

if (!module.parent) {
	startServer();
} else {
	module.exports = startServer;
}