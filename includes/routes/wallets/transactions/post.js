var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'post';

exports.handler = function(req, res, next) {

	var body = req.body || {};
	var wallet_id = api.getParam(req, 'wallet_id', 0);
	var amount = api.getParam(req, 'amount', 0);
	var description = api.getParam(req, 'description', '');
	var subtype = api.getParam(req, 'subtype', 'confirmed');

	var datetime = api.getParam(req, 'datetime', null);

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (!wallet) throw new errors.HaveNoRightsError();
				if (subtype == 'setup')
					return wallet.setTotalTo({
						description: description,
						amount: amount
					});
				else
					return wallet.insertTransaction({
						description: description,
						amount: amount,
						datetime: datetime
					});
			}).then(function(transaction) {
				res.send(transaction);
				next();
			});
	});

};