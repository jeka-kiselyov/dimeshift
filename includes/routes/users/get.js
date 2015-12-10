var rfr = require('rfr');
var db = rfr('includes/models');
var api = rfr('includes/api.js');
var mailer = rfr('includes/mailer.js');

exports.route = '/api/users';
exports.method = 'get';
exports.docs = {
	description: "Get currently signed in user",
	params: {},
	returns: {
		description: "User object.",
		sample: '{"id": 23, "email": "example@gmail.com","login": "userlogin","is_demo": 0}'
	}
};

exports.handler = function(req, res, next) {
	api.requireSignedIn(req, function(user) {
		res.send({
			login: user.login,
			email: user.email,
			id: user.id,
			is_demo: user.is_demo
		});
		next();
	});
};