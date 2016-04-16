var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/plans';
exports.method = 'get';

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