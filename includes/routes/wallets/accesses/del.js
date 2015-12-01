var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/accesses/:wallet_access_id';
exports.method = 'del';


exports.handler = function(req, res, next) {

	var wallet_id = req.params.wallet_id || 0;
	var wallet_access_id = req.params.wallet_access_id || 0;

	api.requireSignedIn(req, function(user) {
		db.WalletAccess.findOne({
				where: {
					id: wallet_access_id,
					wallet_id: wallet_id,
					original_user_id: user.id
				}
			})
			.then(function(wallet_access) {
				if (!wallet_access) throw new errors.HaveNoRightsError();
				return wallet_access.destroy();
			}).then(function(wallet_access) {
				res.send(true);
				next();
			});
	});

};