var rfr = require('rfr');
var db = rfr('models');
var ValidationError = rfr('includes/errors.js');

exports.route = '/api/users';
exports.method = 'post';

exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

    var body = req.body || {};
    
	var login = body.login || '';
	var type = body.type || 'default';
	var password = body.password || '';
	var email = body.email || '';

	var gotUser = null;

	db.User.register({
			login: login,
			type: type,
			password: password,
			email: email
	}).then(function(user) {
		gotUser = user;
		return user.auth();
	}).then(function(authentication) {
		res.setCookie('logged_in_user', authentication.auth_code, { path: '/', maxAge: 365*24*60*60 });
		res.setCookie('is_logged_in_user', '1', { path: '/', maxAge: 365*24*60*60 });

		res.send({
			id: gotUser.id,
			email: gotUser.email,
			login: gotUser.login,
			is_demo: gotUser.is_demo,
			auth_code: authentication.auth_code
		});

		next();				
	}).catch(function(e){
		throw e;
	});

	return true;
};


