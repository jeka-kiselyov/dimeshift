var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id/plans';
exports.method = 'get';
exports.docs = {
	description: "Get list of user's plans",
	params: {},
	returns: {
		description: "Array of plans.",
		sample: '[{"id":53402}, {"id":53412}]'
	}
};

exports.handler = function(req, res, next) {

	var user_id = parseInt(req.params.user_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		user.getUserPlans().then(function(plans) {
			res.send(plans);
			next();
		});
	});

};