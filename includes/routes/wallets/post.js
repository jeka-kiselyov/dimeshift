var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets';
exports.method = 'post';

exports.handler = function(req, res, next) {

	var name = api.getParam(req, 'name', '');
	var currency = api.getParam(req, 'currency', 'USD');

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