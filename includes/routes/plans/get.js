var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans/:plan_id';
exports.method = 'get';
exports.docs = {
	description: "Get plan info",
	params: {},
	returns: {
		description: "Plan object",
		sample: '{"id":1,"name":"","goal_balance":30,"goal_currency":"USD","goal_datetime":23423,"start_balance":"USD","start_currency":"USD","start_datetime":22333,"status":"active","wallets":[{"id":1,"name":"Sample Bank Account Wallet","total":2138.02}]}'
	}
};

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