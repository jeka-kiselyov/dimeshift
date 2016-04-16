var rfr = require('rfr');
var api = rfr('includes/api.js');
var exchange = rfr('includes/exchange.js');

exports.route = '/api/exchange/rates';
exports.method = 'get';

exports.handler = function(req, res, next) {
	res.send(exchange.getRates());
	next();
};