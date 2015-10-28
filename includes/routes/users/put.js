var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id';
exports.method = 'put';


exports.handler = function(req, res, next){

	var user_id = req.params.user_id;

    var body = req.body || {};
	var password = body.password || null;
	var email = body.email || null;
	var login = body.login || null;

	var ip = req.connection.remoteAddress || null;

	var current_password = body.current_password || null;

	api.requireSignedIn(req, function(user){

		var promise = false;
		if (user.is_demo)
			promise = user.fillProfile({email: email, login: login, password: password, ip: ip});
		else
			promise = user.update({password: password, current_password: current_password});

		if (promise === false)
			throw new errors.HaveNoRightsError();

		promise.then(function(user){
			res.send({login: user.login, email: user.email, id: user.id, is_demo: user.is_demo});
			next();
		});

	});
	
};


