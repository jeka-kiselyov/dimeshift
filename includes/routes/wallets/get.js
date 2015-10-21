var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id';
exports.method = 'get';

exports.handler = function(req, res, next){

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);

	api.requireSignedIn(req, function(user){
		db.Wallet.findOne({ where: {id: wallet_id, user_id: user.id} })
		.then(function(wallet){
			if (!wallet)
				throw new errors.NotFoundError();
			res.send(wallet);
			next();
		});
	});
};

