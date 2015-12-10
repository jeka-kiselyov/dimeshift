var rfr = require('rfr');
var db = rfr('includes/models');

exports.route = '/api/users/signout';
exports.method = 'post';
exports.docs = {
	description: 'Signs out current user',
	params: {},
	returns: {
		description: 'Signs out current user. And invalidates auth_code. Also sets logged_in_user cookie to to null in response headers.',
		sample: 'true'
	}
};

exports.handler = function(req, res, next) {
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	res.setCookie('logged_in_user', null, {
		path: '/',
		maxAge: -1
	});
	res.setCookie('is_logged_in_user', null, {
		path: '/',
		maxAge: -1
	});

	res.send(true);
	next();
};