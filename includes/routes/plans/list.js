var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans';
exports.method = 'get';
exports.docs = {
	description: "Get list of user's plans",
	params: {},
	returns: {
		description: "Array of plans",
		sample: '[{"id":1,"name":"","goal_balance":30,"goal_currency":"USD","goal_datetime":null,"start_balance":"USD","start_currency":"USD","start_datetime":null,"status":"active","wallets":[{"id":1,"name":"Sample Bank Account Wallet","total":2138.02}]}]'
	}
};

exports.handler = function(req, res, next) {

	api.requireSignedIn(req, function(user) {
		user.getUserPlans().then(function(plans) {
			var resPlans = [];
			for (var k in plans)
				resPlans.push(plans[k].checkIfFinished());

			db.sequelize.Promise.all(resPlans).then(function() {
				res.send(plans);
				next();
			});
		});
	});

};