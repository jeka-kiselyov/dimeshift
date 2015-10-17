var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Transaction = sequelize.define('Transaction', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		description: DataTypes.STRING(255),
		type: { type: DataTypes.ENUM('profit', 'expense'), defaultValue: 'expense', validate: {
			isIn: { args: [['profit', 'expense']], msg: "Invalid transaction type" }
		} },
		subtype: { type: DataTypes.ENUM('setup', 'confirmed', 'planned'), defaultValue: 'confirmed', validate: {
			isIn: { args: [['setup', 'confirmed', 'planned']], msg: "Invalid transaction subtype" }
		} },
		amount: { type: DataTypes.FLOAT(), defaultValue: 0 },
		abs_amount: { type: DataTypes.FLOAT(), defaultValue: 0 },
		datetime: { type: DataTypes.INTEGER, field: "datetime" }
	},
	{
		timestamps: false,
		indexes: [
			
		],
		freezeTableName: true,
		tableName: 'transactions',
		classMethods: {
		},
		instanceMethods: {
			deleteAndCheckWallet: function(){

				var setUpDiff = -this.amount;
				var wallet_id = this.wallet_id;
				var this_datetime = this.datetime;

				var that = this;

				return new sequelize.Promise(function(resolve, reject) {
					var setUpTransaction = null;

					sequelize.db.Transaction.findOne({
						where: {
							wallet_id: wallet_id,
							subtype: 'setup',
							datetime: {$gt: this_datetime}
						},
						order: 'datetime ASC'
						}).then(function(transaction){
							if (transaction)
							{
								transaction.amount+=setUpDiff;
								transaction.save().then(function(transaction){
									that.destroy();
									resolve();
								});
							}
							else {
								sequelize.query("UPDATE `wallets` SET `total` = `total` + :diff WHERE id = :id",
									{ replacements: { diff: setUpDiff, id: wallet_id } }).then(function(){
										that.destroy();
										resolve();
									});
							}
						},function(err){
							console.log(err);
						});
				});
			}
		}
	});

	return Transaction;
};