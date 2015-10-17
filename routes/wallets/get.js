var rfr = require('rfr');
var db = rfr('models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'get';


exports.handler = function(req, res, next){
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	var authUser = null;

	db.User.getByAuthCode(auth_code).then(function(user){
		authUser = user;
		return db.Wallet.findById(wallet_id);
	}).then(function(wallet){
		if (wallet.user_id == authUser.id)  /// @todo: or is shared
		{
			res.send(wallet);
			next();
		} else {
			throw new errors.HaveNoRightsError();
		}
	}).then(function(transactions){
		res.send(transactions);
		next();
	});
};

