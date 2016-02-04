var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

var fs = require('fs');
var webshot = require('webshot');

exports.route = '/api/wallets/:wallet_id/screenshot';
exports.method = 'get';
exports.docs = {
	description: "Get transactions as image",
	params: {},
	returns: {
		description: "Image file",
		sample: 'binary data'
	}
};

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var options = {
		takeShotOnCallback: true,
		cookies: [{
			name: 'logged_in_user',
			value: auth_code,
			domain: '.localhost'
		}, {
			name: 'is_logged_in_user',
			value: 1,
			domain: '.localhost'
		}],
		renderDelay: 1000,
		screenSize: {
			width: 765,
			height: 300
		},
		shotSize: {
			width: 'window',
			height: 'all'
		},
		userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
	};

	var renderStream = webshot('http://localhost:8080/wallets/92/screenshot', options);
	var file = fs.createWriteStream('google.png', {
		encoding: 'binary'
	});

	res.writeHead(200, {
		'Content-Type': 'image/jpeg'
	});

	renderStream.on('end', function(data) {
		res.end();
		next();
	});

	renderStream.on('data', function(data) {
		res.write(data);
	});

	// webshot('google.com', 'google.png', function(err) {
	// 	// screenshot now saved to google.png 
	// 	res.send(true);
	// });

	next();
};