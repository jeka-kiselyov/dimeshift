var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Wallet = sequelize.define('Wallet', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING(255),
		type: {
			type: DataTypes.ENUM('default', 'user'),
			defaultValue: 'default',
			validate: {
				isIn: {
					args: [
						['default', 'user']
					],
					msg: "Invalid wallet type"
				}
			}
		},
		status: {
			type: DataTypes.ENUM('active', 'hidden'),
			defaultValue: 'active',
			validate: {
				isIn: {
					args: [
						['active', 'hidden']
					],
					msg: "Invalid wallet status"
				}
			}
		},
		currency: {
			type: DataTypes.STRING(10),
			defaultValue: 'USD'
		},
		total: {
			type: DataTypes.FLOAT(),
			defaultValue: 0
		}
	}, {
		timestamps: false,
		indexes: [

		],
		freezeTableName: true,
		tableName: 'wallets',
		classMethods: {},
		instanceMethods: {
			giveAccess: function(params) {
				var params = params || {};
				var email = params.email || '';
				var original_user_id = this.user_id;

				var that = this;
				return new sequelize.Promise(function(resolve, reject) {
					sequelize.db.User.findOne({
						where: {
							email: email
						}
					}).
					then(function(user) {
							if (user)
								return that.createWalletAccess({
									to_email: email,
									to_user_id: user.id,
									original_user_id: original_user_id
								});
							else
								return that.createWalletAccess({
									to_email: email,
									original_user_id: original_user_id
								});
						})
						.then(function(wallet_access) {
							resolve(wallet_access);
						}, function(err) {
							reject(err);
						});
				});
			},
			setTotalTo: function(params) {
				var params = params || {};
				var amount = parseFloat(params.amount, 10) || 0;
				var diff = amount - this.total;

				params.subtype = 'setup';
				params.amount = diff;

				return this.insertTransaction(params);
			},
			insertTransaction: function(params) {
				var params = params || {};
				var description = params.description || '';
				var amount = parseFloat(params.amount, 10) || 0;
				var abs_amount = Math.abs(amount);
				var subtype = params.subtype || 'confirmed';

				var currentDateTime = (Date.now() / 1000 | 0);
				var datetime = currentDateTime;
				var inThePast = false;
				if (parseInt(params.datetime)) {
					datetime = parseInt(params.datetime);
					if (datetime < currentDateTime)
						inThePast = true;
				}

				var type = 'expense';
				if (amount >= 0)
					type = 'profit';

				var user_id = this.user_id;

				var that = this;
				return new sequelize.Promise(function(resolve, reject) {
					that.createTransaction({
						description: description,
						amount: amount,
						abs_amount: abs_amount,
						subtype: subtype,
						datetime: datetime,
						type: type,
						user_id: user_id
					}).then(function(transaction) {
						/// proccess successful calculation
						if (!inThePast) {
							that.total = that.total + transaction.amount;
							that.save().done(function(res) {
								resolve(transaction);
							});
						} else {
							/// need to recalculate
							/// find setup transaction after this current one we've added
							sequelize.db.Transaction.findOne({
								where: {
									wallet_id: that.id,
									subtype: 'setup',
									datetime: {
										$gt: datetime
									}
								},
								order: 'datetime ASC'
							}).then(function(setup_transaction) {
								if (setup_transaction) {
									/// there's setup transaction
									setup_transaction.amount = setup_transaction.amount + transaction.amount;
									setup_transaction.save().done(function(res) {
										resolve(transaction);
									});
								} else {
									/// no setup transaction, update wallet
									that.total = that.total + transaction.amount;
									that.save().done(function(res) {
										resolve(transaction);
									});
								}
							});
						}
					}, function(err) {
						reject(err);
					});
				});
			},
			getWalletPlans: function() {
				var wallet = this;
				return new sequelize.Promise(function(resolve, reject) {

					sequelize.db.Plan.findAll({
						attributes: ['id'],
						where: {
							'user_id': wallet.user_id
						},
						include: [{
							model: sequelize.db.Wallet,
							as: 'wallets',
							attributes: ['id', 'name', 'total'],
							where: {
								id: wallet.id
							},
							through: {
								attributes: []
							}
						}]
					}).then(function(plans) {
						var ids = [];
						for (var k in plans)
							ids.push(plans[k].id);

						sequelize.db.Plan.findAll({
							attributes: ['id', 'user_id', 'name', 'goal_balance', 'goal_currency', 'goal_datetime', 'start_balance', 'start_currency', 'start_datetime', 'end_balance', 'status'],
							where: {
								id: {
									$in: ids
								}
							},
							include: [{
								model: sequelize.db.Wallet,
								as: 'wallets',
								attributes: ['id', 'name', 'total'],
								through: {
									attributes: []
								}
							}]
						}).then(function(plans) {
							resolve(plans);
						});
					});

				});
			}
		}
	});

	return Wallet;
};