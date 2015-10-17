var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Wallet = sequelize.define('Wallet', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: DataTypes.STRING(255),
		type: { type: DataTypes.ENUM('default', 'user'), defaultValue: 'default', validate: {
			isIn: { args: [['default', 'user']], msg: "Invalid wallet type" }
		} },
		status: { type: DataTypes.ENUM('active', 'hidden'), defaultValue: 'active', validate: {
			isIn: { args: [['active', 'hidden']], msg: "Invalid wallet status" }
		} },
		currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
		total: { type: DataTypes.FLOAT(), defaultValue: 0 }
	},
	{
		timestamps: false,
		indexes: [

		],
		freezeTableName: true,
		tableName: 'wallets',
		classMethods: {
		},
		instanceMethods: {
			setTotalTo: function(params) {
				var params = params || {};
				var amount = parseFloat(params.amount,10) || 0;
				var diff = amount - this.total;

				params.subtype = 'setup';
				params.amount = diff;

				return this.insertTransaction(params);
			},
			insertTransaction: function(params) {
				var params = params || {};
				var description = params.description || '';
				var amount = parseFloat(params.amount,10) || 0;
				var abs_amount = Math.abs(amount);
				var subtype = params.subtype || 'confirmed';
				var datetime = parseInt(params.datetime) || (Date.now() / 1000 | 0);

				var type = 'expense'; 
				if (amount >= 0)
					type = 'profit';

				var user_id = this.user_id;

				var that = this;
				return new sequelize.Promise(function(resolve, reject) {
					that.createTransaction({description: description, amount: amount, 
					abs_amount: abs_amount, subtype: subtype, datetime: datetime, 
					type: type, user_id: user_id}).then(function(transaction){
						/// proccess successful calculation
						that.total = that.total + transaction.amount;
						that.save().done(function(res){
							resolve(transaction);
						});
					},function(err){
						reject(err);
					});
				});
			}
		}
	});

	return Wallet;
};