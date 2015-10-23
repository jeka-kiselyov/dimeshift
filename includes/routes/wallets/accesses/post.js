var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/accesses';
exports.method = 'post';

exports.handler = function(req, res, next){
    var body = req.body || {};
	var wallet_id = parseInt(body.wallet_id, 10) || 0;
	var to_email = body.to_email || '';

	api.requireSignedIn(req, function(user){
		db.Wallet.findOne({ where: {id: wallet_id, user_id: user.id}})
		.then(function(wallet){
			if (!wallet) throw new errors.HaveNoRightsError();	
			return wallet.giveAccess({email: to_email});
		}).then(function(wallet_access){
			res.send(wallet_access);
			next();
		}, function(err){
			throw err;
		});
	});
	
};


