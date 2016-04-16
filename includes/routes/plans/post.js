var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans';
exports.method = 'post';


exports.handler = function(req, res, next) {

	var data = {
		name: api.getParam(req, 'name', 'Undefined'),
		goal_balance: api.getParam(req, 'goal_balance', 0),
		goal_currency: api.getParam(req, 'goal_currency', ''),
		goal_datetime: api.getParam(req, 'goal_datetime', 0),
		start_balance: api.getParam(req, 'start_balance', 0),
		start_currency: api.getParam(req, 'start_currency', ''),
		start_datetime: api.getParam(req, 'start_datetime', 0),
		status: api.getParam(req, 'status', 'active'),
		wallets: api.getParam(req, 'wallets', 0)
	};

	api.requireSignedIn(req, function(user) {
		user.addUserPlan(data).then(function(plan) {
			/// loads it from db, to be sure:
			user.getUserPlan(plan.id).then(function(resPlan) {
				res.send(resPlan);
				next();
			});
		});
	});

};