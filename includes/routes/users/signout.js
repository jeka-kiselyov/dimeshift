var rfr = require('rfr');
var db = rfr('includes/models');

exports.route = '/api/users/signout';
exports.method = 'post';

exports.handler = function(req, res, next){
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	res.setCookie('logged_in_user', null, { path: '/', maxAge: -1 });
	res.setCookie('is_logged_in_user', null, { path: '/', maxAge: -1 });

	res.send(true);
	next();
	
	// db.User.getByAuthCode(auth_code).then(function(user)
	// {
	// 	user.signOut();
	// 	res.send(true);
	// 	next();
	// }, function(e){
	// 	res.send(true);
	// 	next();
	// });
};
