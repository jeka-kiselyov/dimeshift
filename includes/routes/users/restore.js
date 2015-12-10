var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.route = '/api/users/restore';
exports.method = 'post';
exports.docs = {
	description: "Start reset password procedure. Generate restore code and hash and send message to user's email.",
	params: {
		"email": {
			required: true,
			description: 'Email',
			type: 'string'
		}
	},
	returns: {
		description: "Generate restore code and hash and send message to user's email.",
		sample: 'true'
	}
};

exports.handler = function(req, res, next) {

	var email = req.params.email || '';

	db.User.resetPassword(email).then(function(user) {
		res.send(true);
		next();
	}, function(e) {
		throw e;
	});

};