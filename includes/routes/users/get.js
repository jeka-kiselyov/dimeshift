var rfr = require('rfr');
var db = rfr('includes/models');
var api = rfr('includes/api.js');

exports.route = '/api/users';
exports.method = 'get';

exports.handler = function(req, res, next){
	api.requireSignedIn(req, function(user){
		res.send({login: user.login, email: user.email, id: user.id, is_demo: user.is_demo});
		next();
	});
};
