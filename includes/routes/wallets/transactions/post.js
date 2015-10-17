var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'post';

exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

    var body = req.body || {};
	var wallet_id = parseInt(body.wallet_id, 10) || 0;
	var amount = parseFloat(body.amount, 10) || 0;
	var description = body.description || '';
	var subtype = body.subtype || 'confirmed';

	var authUser = null;

	db.User.getByAuthCode(auth_code).then(function(user){
		authUser = user;
		return db.Wallet.findById(wallet_id);
	}).then(function(wallet){
		if (wallet.user_id == authUser.id)  /// @todo: or is shared
		{
			if (subtype == 'setup')
				return wallet.setTotalTo({description: description, amount: amount});
			else
				return wallet.insertTransaction({description: description, amount: amount});
		} else {
			throw new errors.HaveNoRightsError();
		}
	}).then(function(transaction){
		res.send(transaction);
		next();
	});
};


