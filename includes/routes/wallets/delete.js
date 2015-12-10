var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'del';
exports.docs = {
	description: "Remove wallet from database. As additional protection, this method removes wallet only if its status == 'hidden'. So you have to call PUT method first and set wallet status to 'hidden' and call DELETE after this.",
	params: {},
	returns: {
		description: "True on success",
		sample: 'true'
	}
};


exports.handler = function(req, res, next) {

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id,
					status: 'hidden'
				}
			})
			.then(function(wallet) {
				return wallet.destroy();
			}).then(function(wallet) {
				res.send(true);
				next();
			});
	});
};