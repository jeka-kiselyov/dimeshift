var rfr = require('rfr');
var db = rfr('includes/models');
var ValidationError = rfr('includes/errors.js');

exports.route = '/api/users/newpassword';
exports.method = 'post';
exports.docs = {
	description: "Update user's password using code and hash generated with /users/restore API method",
	params: {
		"code": {
			required: true,
			description: 'Secure code',
			type: 'string'
		},
		"hash": {
			required: true,
			description: 'Secure hash',
			type: 'string'
		},
		"password": {
			required: true,
			description: 'New password',
			type: 'string'
		},
	},
	returns: {
		description: "True on success.",
		sample: 'true'
	}
};

exports.handler = function(req, res, next) {

	var code = req.params.code || '';
	var hash = req.params.hash || '';
	var password = req.params.password || '';

	db.User.updatePassword(code, hash, password).then(function(user) {
		res.send(true);
		next();
	}, function(e) {
		throw e;
	});

};