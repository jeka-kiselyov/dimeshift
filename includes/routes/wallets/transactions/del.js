var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets/:wallet_id/transactions/:transaction_id';
exports.method = 'del';

exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var transaction_id = parseInt(req.params.transaction_id || 0, 10);

	var authUser = null;

	db.User.getByAuthCode(auth_code).then(function(user){
		authUser = user;
		return db.Wallet.findById(wallet_id);
	}).then(function(wallet){
		if (wallet.user_id == authUser.id)  /// @todo: or is shared
		{
			return db.Transaction.findById(transaction_id);			
		} else {
			throw new errors.HaveNoRightsError();
		}
	}).then(function(transaction){
		if (transaction && transaction.wallet_id == wallet_id)
		{
			return transaction.deleteAndCheckWallet();
		} else {
			throw new errors.HaveNoRightsError();
		}
	}).then(function(){
		res.send(true);
		next();
	});
};


