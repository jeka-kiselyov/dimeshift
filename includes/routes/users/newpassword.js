var rfr = require('rfr');
var db = rfr('includes/models');
var ValidationError = rfr('includes/errors.js');

exports.route = '/api/users/newpassword';
exports.method = 'post';

exports.handler = function(req, res, next){

	var code = req.params.code || '';
	var hash = req.params.hash || '';
	var password = req.params.password || '';

	db.User.updatePassword(code, hash, password).then(function(user){
		res.send(true);
		next();
	}, function(e){
		throw e;
	});

};


