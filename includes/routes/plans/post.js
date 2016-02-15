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



exports.docs = {
	description: "Create new plan for currently signed in user's account",
	params: {
		"name": {
			required: true,
			description: 'Plan name',
			type: 'string'
		},
		"start_currency": {
			required: false,
			description: 'Currency identifier. USD, EUR, BTC etc.',
			type: 'string'
		},
		"start_balance": {
			required: false,
			description: 'Current balance of wallets used in this plan',
			type: 'float'
		},
		"start_datetime": {
			required: false,
			description: 'Current datetime',
			type: 'timestamp'
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
		description: "Plan object",
		sample: '{"id":1,"name":"","goal_balance":30,"goal_currency":"USD","goal_datetime":23423,"start_balance":"USD","start_currency":"USD","start_datetime":22333,"status":"active","wallets":[{"id":1,"name":"Sample Bank Account Wallet","total":2138.02}]}'
	}
};