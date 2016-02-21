var rfr = require('rfr');
var exchange = rfr('includes/exchange.js');

module.exports = function(sequelize, DataTypes) {
	var Plan = sequelize.define('Plan', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING(255),
		goal_balance: {
			type: DataTypes.FLOAT(),
			defaultValue: 0
		},
		goal_currency: {
			type: DataTypes.STRING(10),
			defaultValue: 'USD'
		},
		goal_datetime: {
			type: DataTypes.INTEGER
		},
		start_balance: {
			type: DataTypes.FLOAT(),
			defaultValue: 0
		},
		start_currency: {
			type: DataTypes.STRING(10),
			defaultValue: 'USD'
		},
		start_datetime: {
			type: DataTypes.INTEGER
		},
		end_balance: {
			type: DataTypes.FLOAT(),
			defaultValue: 0
		},
		status: {
			type: DataTypes.ENUM('active', 'finished'),
			defaultValue: 'active',
			field: "status",
			validate: {
				isIn: {
					args: [
						['active', 'finished']
					],
					msg: "Invalid plan status"
				}
			}
		}
	}, {
		timestamps: false,
		indexes: [],
		freezeTableName: true,
		tableName: 'plans',
		classMethods: {},
		instanceMethods: {
			checkIfFinished: function() {
				var plan = this;
				return new sequelize.Promise(function(resolve, reject) {
					if (plan.status == 'finished')
						resolve(plan);
					var currentDateTime = (Date.now() / 1000 | 0);
					if (plan.goal_datetime >= currentDateTime) {
						plan.status = 'finished';
						plan.getCurrentTotal().then(function(total) {
							plan.end_balance = total;
							return plan.save();
						}).then(function(plan) {
							resolve(plan);
						});
					} else {
						resolve(plan);
					}
				});
			},
			updateWalletsIds: function(wallets_ids) {
				var plan = this;
				/// remove duplicate elements
				wallets_ids = wallets_ids.reduce(function(p, c) {
					if (p.indexOf(c) < 0) p.push(c);
					return p;
				}, []);

				return new sequelize.Promise(function(resolve, reject) {
					/// need to check if all wallets are user's wallets
					sequelize.db.Wallet.findAll({
						where: {
							id: {
								$in: wallets_ids
							}
						}
					}).then(function(wallets) {
						var goodWalletsCount = 0;
						for (var k in wallets_ids) {
							for (var j in wallets)
								if (wallets[j].id == wallets_ids[k] && wallets[j].user_id == plan.user_id)
									goodWalletsCount++;
						}

						if (goodWalletsCount != wallets_ids.length)
							throw "Invalid wallets ids";

						plan.setWallets(wallets_ids).then(function() {
							plan.save().then(function(plan) {
								resolve(plan);
							});
						});
					});
				});
			},
			getCurrentTotal: function() {
				var plan = this;
				return new sequelize.Promise(function(resolve, reject) {
					plan.getWallets().then(function(wallets) {
						var balance = 0;
						var walletTotal = 0;
						// @todo: use exchange rates to recalculate
						for (var k in wallets) {
							walletTotal = exchange.convert(wallets[k].total, wallets[k].currency, plan.goal_currency);
							balance += walletTotal;
						}

						resolve(balance);
					});
				});
			},
			setDefaultValues: function() {
				var plan = this;
				return new sequelize.Promise(function(resolve, reject) {
					if (!plan.start_datetime)
						plan.start_datetime = Date.now() / 1000 | 0;
					if (!plan.status)
						plan.status = 'active';
					if (!plan.name)
						plan.name = 'Undefined';
					if (!plan.start_currency && plan.goal_currency)
						plan.start_currency = plan.goal_currency;
					if (!plan.goal_currency && plan.start_currency)
						plan.goal_currency = plan.start_currency;
					if (!plan.start_balance && !plan.isNewRecord) {
						/// get start_balance from wallets
						plan.getWallets().then(function(wallets) {
							var start_balance = 0;
							// @todo: use exchange rates to recalculate
							for (var k in wallets)
								start_balance += wallets[k].total;
							plan.start_balance = start_balance;

							resolve(plan);
						});
					} else {
						resolve(plan);
					}
				});
			}

		}
	});

	return Plan;
};