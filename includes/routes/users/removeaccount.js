var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id/removeaccount';
exports.method = 'post';


exports.handler = function(req, res, next) {

	var user_id = parseInt(req.params.user_id || 0, 10);
	var code = api.getParam(req, 'code', null);

	api.requireSignedIn(req, function(user) {
		if (user_id != user.id)
			throw 'Invalid user id';

		if (code === null) /// first step, no code parameter
		{
			user.removeAccount().then(function(user) {
				res.send(true);
				next();
			});
		} else {
			/// second step, with code
			db.User.findOne({
				where: {
					id: user_id,
					remove_account_code: code
				}
			}).then(function(user) {
				if (!user) {
					res.send(false);
					next();
				}
				user.removeAccountConfirm(code).then(function(success) {
					res.send(success);
					next();
				});
			});
		}
	});
};