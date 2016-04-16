var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');


exports.route = '/api/plans/:plan_id';
exports.method = 'put';

exports.handler = function(req, res, next) {

	var plan_id = req.params.plan_id || 0;

	var data = {
		name: api.getParam(req, 'name', null),
		goal_balance: api.getParam(req, 'goal_balance', null),
		goal_currency: api.getParam(req, 'goal_currency', null),
		goal_datetime: api.getParam(req, 'goal_datetime', null),
		wallets: api.getParam(req, 'wallets', null)
	};

	api.requireSignedIn(req, function(user) {
		db.Plan.findOne({
				where: {
					id: plan_id,
					user_id: user.id
				}
			})
			.then(function(plan) {
				if (data.name !== null) plan.name = data.name;
				if (data.goal_balance !== null) plan.goal_balance = data.goal_balance;
				if (data.goal_currency !== null) plan.goal_currency = data.goal_currency;
				if (data.goal_datetime !== null) plan.goal_datetime = data.goal_datetime;

				if (data.wallets !== null)
					return plan.updateWalletsIds(data.wallets);
				else
					return plan.save();
			}).then(function(plan) {
				/// loads it from db, to be sure:
				user.getUserPlan(plan.id).then(function(resPlan) {
					res.send(resPlan);
					next();
				});
			});
	});

};