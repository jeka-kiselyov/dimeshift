module.exports = function(sequelize, DataTypes) {
	var Authentication = sequelize.define('WalletAccess', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		to_email: {
			type: DataTypes.STRING(255),
			validate: {
				isEmail: {
					msg: "Invalid email"
				}
			}
		},
	}, {
		timestamps: false,
		indexes: [{
			unique: true,
			fields: ['to_email']
		}],
		freezeTableName: true,
		tableName: 'wallet_accesses',
		classMethods: {
			checkAccessForNewUser: function(user) {
				var email = user.email;
				var new_user_id = user.id;

				sequelize.db.WalletAccess.findAll({
						where: {
							to_email: email,
							to_user_id: null
						}
					})
					.then(function(wallet_accesses) {
						wallet_accesses.forEach(function(wallet_access) {
							wallet_access.to_user_id = new_user_id;
							wallet_access.save();
						});
					});
			},
			getWalletIfHasAccess: function(user, wallet_id) {
				return new sequelize.Promise(function(resolve, reject) {

					sequelize.db.Wallet.findOne({
							where: {
								id: wallet_id
							}
						})
						.then(function(wallet) {
							if (!wallet)
								resolve(null);
							if (wallet.user_id == user.id)
								resolve(wallet);
							else {

								sequelize.query("SELECT wallets.* FROM wallets JOIN wallet_accesses ON wallet_accesses.wallet_id = wallets.id WHERE wallets.id = :wallet_id AND wallet_accesses.to_user_id = :user_id", {
										replacements: {
											user_id: user.id,
											wallet_id: wallet_id
										},
										model: sequelize.db.Wallet
									})
									.then(function(wallets) {
										if (!wallets.length)
											resolve(null);
										else
											resolve(wallets[0]);
									}, function(err) {
										reject(err);
									});

							}
						});

				});
			}
		},
		instanceMethods: {}
	});

	return Authentication;
};