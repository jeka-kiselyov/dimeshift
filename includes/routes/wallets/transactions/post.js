var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var api = rfr('includes/api.js');

exports.route = '/api/wallets/:wallet_id/transactions';
exports.method = 'post';
exports.docs = {
	description: "Add new transaction",
	params: {
		"wallet_id": {
			required: true,
			description: 'Wallet ID. Should be the same as in URL param',
			type: 'string'
		},
		"amount": {
			required: true,
			description: 'Transaction amount',
			type: 'float'
		},
		"description": {
			required: false,
			description: 'Transaction description',
			type: 'string'
		},
		"subtype": {
			required: false,
			description: "Transaction subtype. Default is 'confirmed'. If subtype is 'setup', it sets wallet total to amount.",
			type: 'string'
		},
		"datetime": {
			required: false,
			description: "Default is current unix timestamp",
			type: 'timestamp'
		}
	},
	returns: {
		description: "Transaction object",
		sample: '{"id":53402,"description":"Desc","amount":-42.33,"abs_amount":42.33,"subtype":"confirmed","datetime":1449706027,"type":"expense","user_id":1,"wallet_id":2103}'
	}
};

exports.handler = function(req, res, next) {

	var body = req.body || {};
	var wallet_id = parseInt(body.wallet_id, 10) || 0;
	var amount = parseFloat(body.amount, 10) || 0;
	var description = body.description || '';
	var subtype = body.subtype || 'confirmed';
	var datetime = body.datetime || null;

	api.requireSignedIn(req, function(user) {
		db.Wallet.findOne({
				where: {
					id: wallet_id,
					user_id: user.id
				}
			})
			.then(function(wallet) {
				if (!wallet) throw new errors.HaveNoRightsError();
				if (subtype == 'setup')
					return wallet.setTotalTo({
						description: description,
						amount: amount
					});
				else
					return wallet.insertTransaction({
						description: description,
						amount: amount,
						datetime: datetime
					});
			}).then(function(transaction) {
				res.send(transaction);
				next();
			});
	});

};