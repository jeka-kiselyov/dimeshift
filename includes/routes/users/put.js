var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id';
exports.method = 'put';
exports.docs = {
	description: "Update currently signed in user. Finish demo registration if is_demo == 1 with email, login and password parameters. Or update password with current_password and password parameters.",
	params: {
		"email": {
			required: false,
			description: 'Email',
			type: 'string'
		},
		"login": {
			required: false,
			description: 'Login or Username',
			type: 'string'
		},
		"current_password": {
			required: false,
			description: 'User type',
			type: 'string'
		},
		"password": {
			required: false,
			description: 'Password',
			type: 'string'
		}
	},
	returns: {
		description: "User record with auth_code property. Use this auth_code for signing next API calls. Also sets logged_in_user cookie to auth_code in response headers.",
		sample: '{"id": 23, "email": "example@gmail.com","login": "userlogin","is_demo": 0}'
	}
};


exports.handler = function(req, res, next) {

	var user_id = req.params.user_id;

	var body = req.body || {};
	var password = body.password || null;
	var email = body.email || null;
	var login = body.login || null;

	var ip = api.getVisitorIp(req);

	var current_password = body.current_password || null;

	api.requireSignedIn(req, function(user) {

		var promise = false;
		if (user.is_demo)
			promise = user.fillProfile({
				email: email,
				login: login,
				password: password,
				ip: ip
			});
		else
			promise = user.update({
				password: password,
				current_password: current_password
			});

		if (promise === false)
			throw new errors.HaveNoRightsError();

		promise.then(function(user) {
			res.send({
				login: user.login,
				email: user.email,
				id: user.id,
				is_demo: user.is_demo
			});
			next();
		});

	});

};