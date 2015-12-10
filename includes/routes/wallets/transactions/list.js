var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'get';
exports.docs = {
	description: "Get list of wallet's transactions",
	params: {
		"from": {
			required: true,
			description: 'From unix timestamp',
			type: 'timestamp'
		},
		"to": {
			required: true,
			description: 'To unix timestamp',
			type: 'timestamp'
		}
	},
	returns: {
		description: "Array of transactions. Filtered by datetime.",
		sample: '[{"id":53402,"description":"Desc","amount":-42.33,"abs_amount":42.33,"subtype":"confirmed","datetime":1449706027,"type":"expense","user_id":1,"wallet_id":2103}, {"id":53412,"description":"Text","amount":0.99,"abs_amount":0.99,"subtype":"confirmed","datetime":1449736027,"type":"profit","user_id":1,"wallet_id":2103}]'
	}
};

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var to = parseInt(req.params.to || 0, 10);
	var from = parseInt(req.params.from || 0, 10);

	api.requireSignedIn(req, function(user) {
		user.getWalletIfHasAccess(wallet_id)
			.then(function(wallet) {
				if (!wallet) throw new errors.HaveNoRightsError();
				return db.Transaction.findAll({
					where: {
						wallet_id: wallet.id,
						datetime: {
							$lte: to,
							$gt: from
						}
					}
				});
			}).then(function(transactions) {
				res.send(transactions);
				next();
			});
	});

};