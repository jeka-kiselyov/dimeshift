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
		status: {
			type: DataTypes.ENUM('active', 'finished'),
			defaultValue: 'active',
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