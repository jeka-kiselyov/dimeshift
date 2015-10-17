var rfr = require('rfr');
var db = rfr('models');

exports.route = '/api/users';
exports.method = 'get';

exports.handler = function(req, res, next){
	var cookies = req.cookies; // Gets read-only cookies from the request 
	var auth_code = cookies.logged_in_user || '';

	db.User.getByAuthCode(auth_code).done(function(user)
	{
		res.send({login: user.login, email: user.email, id: user.id, is_demo: user.is_demo});
		next();
	}, function(e){
		res.send(false);
		next();
	});
};
