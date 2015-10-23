var rfr = require('rfr');
var api = rfr('includes/api.js');

exports.route = '/api/i18n/bycode/:code';
exports.method = 'get';

exports.handler = function(req, res, next){
	var code = req.params.code || en;
	var body = api.geti18njson(code);

	res.writeHead(200, {
		'Content-Length': Buffer.byteLength(body),
		'Content-Type': 'application/json'
	});
	
	res.write(body);
	res.end();
	next();
};
