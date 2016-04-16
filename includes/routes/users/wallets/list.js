var rfr = require('rfr');
var db = rfr('includes/models');
var api = rfr('includes/api.js');

exports.route = '/api/users/:user_id/wallets';
exports.method = 'get';

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