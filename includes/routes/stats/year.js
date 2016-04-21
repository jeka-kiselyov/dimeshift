var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/stats/year';
exports.method = 'get';

exports.handler = function(req, res, next) {

	var utcoffset = parseInt(req.params.utcoffset || 0, 10); // http://momentjs.com/docs/#/manipulating/utc-offset/

	api.requireSignedIn(req, function(user) {
		user.getStats({period: 'year', utcOffset: utcoffset}).then(function(stats){
			res.send(stats);
			next();
		});
	});

};