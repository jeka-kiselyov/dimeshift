var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/users/restore';
exports.method = 'post';

exports.handler = function(req, res, next){

	var email = req.params.email || '';

	db.User.resetPassword(email).then(function(user){
		res.send(true);
		next();
	}, function(e){
		throw e;
	});

};


