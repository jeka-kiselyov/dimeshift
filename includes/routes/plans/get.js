var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans/:plan_id';
exports.method = 'get';

exports.handler = function(req, res, next) {

	var plan_id = parseInt(req.params.plan_id || 0, 10);

	api.requireSignedIn(req, function(user) {
		user.getUserPlan(plan_id).then(function(resPlan) {
			resPlan.checkIfFinished().then(function(plan) {
				res.send(plan);
				next();
			});
		});
	});
};