var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions/:transaction_id';
exports.method = 'del';
exports.docs = {
	description: "Remove transaction from database. Also recalculate wallet total.",
	params: {},
	returns: {
		description: "True on success",
		sample: 'true'
	}
};

exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var transaction_id = parseInt(req.params.transaction_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (!wallet) throw new errors.NotFoundError();
				return db.Transaction.findOne({
					where: {
						id: transaction_id,
						wallet_id: wallet.id
					}
				});
			}).then(function(transaction) {
				if (!transaction) throw new errors.NotFoundError();
				return transaction.deleteAndCheckWallet();
			}).then(function() {
				res.send(true);
				next();
			})
	});

};