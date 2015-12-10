var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/accesses';
exports.method = 'post';
exports.docs = {
	description: "Add new access to wallet. User registered(already or later) with to_email will be able to view wallet.",
	params: {
		"wallet_id": {
			required: true,
			description: 'Wallet ID. Should be the same as in URL param',
			type: 'string'
		},
		"to_email": {
			required: true,
			description: 'Email',
			type: 'string'
		},
	},
	returns: {
		description: "Access object",
		sample: '{"id":11,"to_email":"example@gmail.com","wallet_id":4,"original_user_id":1,"to_user_id":null}'
	}
};


exports.handler = function(req, res, next) {
	var body = req.body || {};
	var wallet_id = parseInt(body.wallet_id, 10) || 0;
	var to_email = body.to_email || '';

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (!wallet) throw new errors.HaveNoRightsError();
				return wallet.giveAccess({
					email: to_email
				});
			}).then(function(wallet_access) {
				res.send(wallet_access);
				next();
			}, function(err) {
				throw err;
			});
	});

};