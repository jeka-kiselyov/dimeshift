var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/wallets';
exports.method = 'post';


exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

    var body = req.body || {};
	var name = body.name || '';
	var currency = body.currency || 'USD';

	db.User.getByAuthCode(auth_code).then(function(user){
		return user.insertWallet({name: name, currency: currency});
	}).then(function(wallet){
		res.send(wallet);
		next();
	});
};


