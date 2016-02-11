var rfr = require('rfr');
var api = rfr('includes/api.js');
var exchange = rfr('includes/exchange.js');

exports.route = '/api/exchange/rates';
exports.method = 'get';
exports.docs = {
	description: "Get most recent exchange rates.",
	params: {},
	returns: {
		description: "rates and base currency",
		sample: '{"rates":{"AED":3.672996,"AFN":68.879999},"base":"USD"}'
	}
};

exports.handler = function(req, res, next) {
	res.send(exchange.getRates());
	next();
};