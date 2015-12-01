var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Authentication = sequelize.define('Authentication', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		auth_code: DataTypes.STRING(100)
	}, {
		timestamps: false,
		indexes: [{
			unique: true,
			fields: ['auth_code']
		}],
		freezeTableName: true,
		tableName: 'authentications',
		classMethods: {},
		instanceMethods: {}
	});

	return Authentication;
};