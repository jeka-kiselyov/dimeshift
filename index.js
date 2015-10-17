var CookieParser = require('restify-cookies');
var restify = require('restify');
var db = require('./models');
var routes = require('./routes');
var servers = require('./includes/servers');

var server = restify.createServer({
  name: 'DimeShift',
});

server.pre(restify.pre.sanitizePath());
server.on('uncaughtException', function (req, res, route, err) 
{
	return res.send(err);
});
db.Sequelize.Promise.onPossiblyUnhandledRejection(function(reason) {
	throw reason;
});

server.use(CookieParser.parse);
server.use(restify.queryParser());
server.use(restify.bodyParser());

routes(function(routes){
	routes.forEach(function(route){
		server[route.method](route.route, route.handler);
	});
});

server.get(/jstemplates\/?.*/, servers['static_file_server']({ directory: './public', suffix: '.tpl' }));
server.get(/images\/?.*/, servers['images_server']());

server.get('/resources/js.js', servers['minify_server'](
	require('./config/resources.json')['javascript']
));

server.get('/resources/css.css', servers['minify_server'](
	require('./config/resources.json')['css']
));


var index = restify.serveStatic({
  directory: './public',
  file: 'index.html'
});

server.get('/\/?.*/', index);
server.get('wallets', index);
server.get('profile', index);
server.get('wallets/:wallet_id', index);

server.get(/\/scripts\/?.*/, restify.serveStatic({
  directory: './public'
}));
server.get(/\/vendors\/?.*/, restify.serveStatic({
  directory: './public'
}));

db.sequelize.sync()
.then(function(err) {
    // Listening in 8080 Port
	
	server.listen(process.env.PORT);
	console.log("Server started: http://localhost:"+process.env.PORT+"/");
});