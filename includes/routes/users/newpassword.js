var rfr = require('rfr');
var db = rfr('includes/models');
var ValidationError = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/newpassword';
exports.method = 'post';

exports.handler = function(req, res, next) {

	var code = api.getParam(req, 'code', '');
	var hash = api.getParam(req, 'hash', '');
	var password =api.getParam(req, 'password', '');

	db.User.updatePassword(code, hash, password).then(function(user) {
		res.send(true);
		next();
	}, function(e) {
		throw e;
	});

};