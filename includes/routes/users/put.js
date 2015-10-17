var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/users/:user_id';
exports.method = 'put';


exports.handler = function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');

	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var user_id = req.params.user_id;

    var body = req.body || {};
	var password = body.password || null;
	var email = body.email || null;
	var login = body.login || null;

	var current_password = body.current_password || null;

	var gotUser = null

	db.User.getByAuthCode(auth_code).then(function(user){
		gotUser = user;
		var promise = false;
		if (user.is_demo)
			promise = user.fillProfile({email: email, login: login, password: password});
		else
			promise = user.update({password: password, current_password: current_password});

		if (promise === false)
			throw new errors.HaveNoRightsError(); 
		else
			return promise;
	}).then(function(user) {

		res.send({
			id: gotUser.id,
			email: gotUser.email,
			is_demo: gotUser.is_demo,
			login: gotUser.login
		});

		next();	
	});
};


