var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'get';
exports.docs = {
	description: "Get wallet info",
	params: {},
	returns: {
		description: "Wallet object",
		sample: '{"id":4,"name":"Cash. EUR","type":"default","status":"active","currency":"EUR","total":300,"user_id":1}'
	}
};

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		user.getWalletIfHasAccess(wallet_id)
			.then(function(wallet) {
				if (!wallet)
					throw new errors.NotFoundError();
				res.send(wallet);
				next();
			});
	});
};