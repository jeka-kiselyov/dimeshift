var rfr = require('rfr');
var db = rfr('models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'get';

exports.handler = function(req, res, next){
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var to = parseInt(req.params.to || 0, 10);
	var from = parseInt(req.params.from || 0, 10);

	var authUser = null;

	db.User.getByAuthCode(auth_code).then(function(user){
		authUser = user;
		return db.Wallet.findById(wallet_id);
	}).then(function(wallet){
		if (wallet.user_id == authUser.id)  /// @todo: or is shared
		{
			return db.Transaction.findAll({
				where: {
					wallet_id: wallet.id,
					datetime: {$lte: to, $gt: from}
				}
			});
		} else {
			throw new errors.HaveNoRightsError();
		}
	}).then(function(transactions){
		res.send(transactions);
		next();
	});
};



		// db.Transaction.findAll({
		// 	where: {
		// 		user_id: user.id
		// 	}
		// });
		// return user.getWallets();