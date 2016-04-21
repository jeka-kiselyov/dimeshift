var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/signin';
exports.method = 'post';

exports.handler = function(req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', '*');

	var username = api.getParam(req, 'username', '');
	var password = api.getParam(req, 'password', '');
	console.log(username);
	console.log(password);
	var gotUser = null;

	db.User.signIn({
		username: username,
		password: password
	}).then(function(user) {
		gotUser = user;
		return user.auth();
	}).then(function(authentication) {
		res.setCookie('logged_in_user', authentication.auth_code, {
			path: '/',
			maxAge: 365 * 24 * 60 * 60
		});
		res.setCookie('is_logged_in_user', '1', {
			path: '/',
			maxAge: 365 * 24 * 60 * 60
		});

		res.send({
			id: gotUser.id,
			email: gotUser.email,
			login: gotUser.login,
			is_demo: gotUser.is_demo,
			auth_code: authentication.auth_code
		});
		next();
	}).catch(function(e) {
		throw e;
	});

	return true;
};