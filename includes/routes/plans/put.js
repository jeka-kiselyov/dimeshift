var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');



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

exports.route = '/api/plans/:plan_id';
exports.method = 'put';
exports.docs = {
	description: "Update plan under currently signed in user's account",
	params: {
		"name": {
			required: true,
			description: 'Plan name',
			type: 'string'
		},
		"goal_currency": {
			required: false,
			description: 'Currency identifier. USD, EUR, BTC etc.',
			type: 'string'
		},
		"goal_balance": {
			required: true,
			description: 'Planned balance of wallets used in this plan on goal_datetime',
			type: 'float'
		},
		"goal_datetime": {
			required: true,
			description: 'Datetime',
			type: 'timestamp'
		},
		"status": {
			required: false,
			description: 'Plan status. "active" or "finished".',
			type: 'timestamp'
		}
	},
	returns: {
		description: "Updated plan object",
		sample: '{"id":1,"name":"","goal_balance":30,"goal_currency":"USD","goal_datetime":23423,"start_balance":"USD","start_currency":"USD","start_datetime":22333,"status":"active","wallets":[{"id":1,"name":"Sample Bank Account Wallet","total":2138.02}]}'
	}
};