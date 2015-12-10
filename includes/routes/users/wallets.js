var rfr = require('rfr');
var db = rfr('includes/models');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id/wallets';
exports.method = 'get';
exports.docs = {
	description: "Get list of user's wallets",
	params: {},
	returns: {
		description: "Array of user's wallets. Own(with `origin` property of 'mine') and shared with user(with `origin` property of 'shared').",
		sample: '[{"id":4,"name":"Cash","status":"active","currency":"EUR","total":300,"origin":"mine"},{"id":32,"name":"Bitcoins","status":"active","currency":"BTC","total":12.99,"origin":"shared"}]'
	}
};

exports.handler = function(req, res, next) {
	api.requireSignedIn(req, function(user) {

		db.sequelize.Promise.join(
			user.getWallets(),
			user.getSharedWallets(),
			function(own, shared) {
				res.send(
					shared.map(
						function(wallet) {
							return {
								id: wallet.id,
								name: wallet.name,
								status: wallet.status,
								currency: wallet.currency,
								total: wallet.total,
								origin: 'shared'
							};
						}
					).concat(
						own.map(
							function(wallet) {
								return {
									id: wallet.id,
									name: wallet.name,
									status: wallet.status,
									currency: wallet.currency,
									total: wallet.total,
									origin: 'mine'
								};
							}
						)
					)
				);
				next();
			}
		);


	});
};