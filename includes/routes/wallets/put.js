var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'put';

exports.handler = function(req, res, next) {

	var wallet_id = req.params.wallet_id || 0;
	
	var name = api.getParam(req, 'name', null);
	var currency = api.getParam(req, 'currency', null);
	var status = api.getParam(req, 'status', null);

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (name !== null) wallet.name = name;
				if (currency !== null) wallet.currency = currency;
				if (status !== null) wallet.status = status;

				return wallet.save();
			}).then(function(wallet) {
				res.send(wallet);
				next();
			});
	});

};