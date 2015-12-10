var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets';
exports.method = 'post';
exports.docs = {
	description: "Create new wallet under currently signed in user's account",
	params: {
		"name": {
			required: true,
			description: 'Wallet name',
			type: 'string'
		},
		"currency": {
			required: true,
			description: 'Currency identifier. USD, EUR, BTC etc',
			type: 'string'
		}
	},
	returns: {
		description: "Wallet object",
		sample: '{"type":"default","status":"active","total":0,"id":2100,"name":"Name","currency":"USD","user_id":1}'
	}
};


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