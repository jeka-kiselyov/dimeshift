var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets';
exports.method = 'post';


exports.handler = function(req, res, next) {

	var body = req.body || {};
	var name = body.name || '';
	var currency = body.currency || 'USD';

	api.requireSignedIn(req, function(user) {
		user.insertWallet({
				name: name,
				currency: currency
			})
			.then(function(wallet) {
				res.send(wallet);
				next();
			});
	});

};