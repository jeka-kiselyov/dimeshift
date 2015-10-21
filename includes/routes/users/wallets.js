var rfr = require('rfr');
var db = rfr('includes/models');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id/wallets';
exports.method = 'get';

exports.handler = function(req, res, next){
	api.requireSignedIn(req, function(user){
		user.getWallets().then(function(wallets){
			res.send(wallets);
			next();
		});
	});
};
