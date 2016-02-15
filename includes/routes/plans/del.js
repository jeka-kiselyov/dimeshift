var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans/:plan_id';
exports.method = 'del';
exports.docs = {
	description: "Remove plan from database.",
	params: {},
	returns: {
		description: "True on success",
		sample: 'true'
	}
};

exports.handler = function(req, res, next) {

	var plan_id = req.params.plan_id || 0;

	api.requireSignedIn(req, function(user) {
		db.Plan.findOne({
				where: {
					id: plan_id,
					user_id: user.id
				}
			})
			.then(function(plan) {
				if (!plan) throw new errors.HaveNoRightsError();
				return plan.destroy();
			}).then(function(plan) {
				res.send(true);
				next();
			});
	});

};