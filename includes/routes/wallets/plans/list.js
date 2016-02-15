var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/plans';
exports.method = 'get';
exports.docs = {
	description: "Get list of plans for wallet",
	params: {},
	returns: {
		description: "Array of plans",
		sample: '[{"id":1,"name":"","goal_balance":30,"goal_currency":"USD","goal_datetime":null,"start_balance":"USD","start_currency":"USD","start_datetime":null,"status":"active","wallets":[{"id":1,"name":"Sample Bank Account Wallet","total":2138.02}]}]'
	}
};

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (!wallet) throw new errors.HaveNoRightsError();
				return wallet.getWalletPlans();
			})
			.then(function(plans) {
				res.send(plans);
				next();
			});
	});

};