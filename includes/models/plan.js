module.exports = function(sequelize, DataTypes) {
	var Plan = sequelize.define('Plan', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
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
			type: DataTypes.STRING(10),
			defaultValue: 'USD'
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
		instanceMethods: {}
	});

	return Plan;
};