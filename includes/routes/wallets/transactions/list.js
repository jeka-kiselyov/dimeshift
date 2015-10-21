var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'get';

exports.handler = function(req, res, next){

	var wallet_id = parseInt(req.params.wallet_id || 0, 10);
	var to = parseInt(req.params.to || 0, 10);
	var from = parseInt(req.params.from || 0, 10);

	api.requireSignedIn(req, function(user){
		db.Wallet.findOne({ where: {id: wallet_id, user_id: user.id}})
		.then(function(wallet){
			if (!wallet) throw new errors.HaveNoRightsError();	
			return db.Transaction.findAll({
				where: {
					wallet_id: wallet.id,
					datetime: {$lte: to, $gt: from}
				}
			});
		}).then(function(transactions){
			res.send(transactions);
			next();
		});
	});

};

