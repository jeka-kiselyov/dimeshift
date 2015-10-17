var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'del';


exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var wallet_id = req.params.wallet_id;

	db.User.getByAuthCode(auth_code).then(function(user){
		return db.sequelize.db.Wallet.findOne({ where: {id: wallet_id, user_id: user.id, status: 'hidden'} });
	}).then(function(wallet){		
		return wallet.destroy();
	}).then(function(wallet){
		res.send(wallet);
		next();		
	});
};


