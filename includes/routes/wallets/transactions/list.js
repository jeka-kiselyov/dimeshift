var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'get';

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var to = parseInt(req.params.to || 0, 10);
	var from = parseInt(req.params.from || 0, 10);

	if (to === 0 || from === 0) {
		to = Math.floor(Date.now() / 1000);
		from = to - 24 * 60 * 60 * 31;
	}

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
					},
					order: [['datetime', 'DESC']]
				});
			}).then(function(transactions) {
				res.send(transactions);
				next();
			});
	});

};