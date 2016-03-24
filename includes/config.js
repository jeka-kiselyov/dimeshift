var rfr = require('rfr');
var env = process.env.NODE_ENV || 'development';
var config = rfr('config/config.json');
var net = require('net');

if (typeof(config[env]) == 'undefined')
	config = config['development'];
else
	config = config[env];

config['env'] = env;
config['resources'] = rfr('config/resources.json');
if (config['port'] === 0) {
	var portrange = 45032

	function getPort(cb) {
		var port = portrange
		portrange += 1

		var server = net.createServer()
		server.listen(port, function(err) {
			server.once('close', function() {
				cb(port)
			})
			server.close()
		})
		server.on('error', function(err) {
			getPort(cb)
		})
	}

	config['port'] = getPort;
}

module.exports = config;