var rfr = require('rfr');
var db = rfr('models');

exports.route = '/api/users/:user_id/wallets';
exports.method = 'get';

exports.handler = function(req, res, next){
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	db.User.getByAuthCode(auth_code).then(function(user){
		return user.getWallets();
	}).then(function(wallets){
		res.send(wallets);
		next();
	});
};
