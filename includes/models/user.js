var crypto = require('crypto');
var rfr = require('rfr');
var demo = rfr('includes/demo.js');
var mailer = rfr('includes/mailer.js');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataTypes.STRING(255),
			validate: {
				isEmail: {
					msg: "Invalid email"
				},
				isUnique: function(value, next) {
					var that = this;
					sequelize.db.User.findOne({
							where: {
								email: value,
								id: {
									$ne: this.id
								}
							},
							attributes: ['id']
						})
						.then(function(foundUser) {
							if (foundUser)
								throw new Error('Email is already in use');
							next();
						}).catch(function(err) {
							throw new Error('Email is already in use');
						});
				}
			}
		},
		type: {
			type: DataTypes.STRING(20),
			defaultValue: 'default',
			validate: {
				isIn: {
					args: [
						['default', 'facebook']
					],
					msg: "Invalid user type"
				}
			}
		},
		password: DataTypes.STRING(50),
		login: {
			type: DataTypes.STRING(255),
			validate: {
				isUnique: function(value, next) {
					var that = this;
					sequelize.db.User.findOne({
							where: {
								login: value,
								id: {
									$ne: this.id
								}
							},
							attributes: ['id']
						})
						.then(function(foundUser) {
							if (foundUser)
								throw new Error('This username is already in use');
							next();
						}).catch(function(err) {
							throw new Error('This username is already in use');
						});
				}
			}
		},
		is_demo: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		},
		is_admin: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		},
		registration_date: DataTypes.INTEGER,
		activity_date: DataTypes.INTEGER,
		registration_ip: DataTypes.STRING(20),
		activity_ip: DataTypes.STRING(20),
		confirmation_code: DataTypes.STRING(255),
		remove_account_code: DataTypes.STRING(255),
		password_restore_code: DataTypes.STRING(255),
		is_banned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		}
	}, {
		timestamps: false,
		freezeTableName: true,
		tableName: 'users',
		classMethods: {
			hashPassword: function(password) {
				return crypto.createHash('md5').update(password + 'password_salt').digest("hex");
			},
			register: function(params) {
				var params = params || {};
				var type = params.type || 'default';
				var login = params.login || '';
				var password = params.password || '';
				var email = params.email || '';
				var ip = params.ip || null;
				var is_demo = 0;

				if (email == 'demo@demo.com') {
					email = 'email' + Math.random() + '@example.com';
					login = 'login' + Math.random();
					password = 'password' + Math.random();
					type = 'default';
					is_demo = 1;
				}

				password = this.hashPassword(password);

				return new sequelize.Promise(function(resolve, reject) {
					var user = sequelize.db.User.build({
						type: type,
						email: email,
						login: login,
						password: password
					});
					user.registration_date = Date.now() / 1000 | 0;
					user.registration_ip = ip;
					user.is_demo = is_demo;

					user.save().then(function(user) {
						if (is_demo) {
							demo.fillDemoAccount(user).then(function() {
								resolve(user);
							});
						} else {
							sequelize.db.WalletAccess.checkAccessForNewUser(user);
							resolve(user);
						}
					}, function(err) {
						reject(err);
					});
				});

			},
			registerDemo: function(params, callback) {

			},
			removeOldDemoAccounts: function() {
				var maxTimestamp = (Date.now() / 1000 | 0) - 2 * 24 * 60 * 60;
				return sequelize.query("DELETE FROM users WHERE is_demo = 1 AND registration_date < :max_timestamp", {
					replacements: {
						max_timestamp: maxTimestamp
					}
				});

			},
			updatePassword: function(code, hash, password) {
				return new sequelize.Promise(function(resolve, reject) {
					if (password.length < 6)
						return reject('Password is too short');

					sequelize.db.User.findOne({
						where: {
							password_restore_code: code
						}
					}).then(function(user) {
						if (!user)
							return reject('Invalid reset password code');
						var restore_password_hash = sequelize.db.User.hashPassword(user.id + user.password_restore_code);
						if (hash != restore_password_hash)
							return reject('Invalid reset password code');

						password = sequelize.db.User.hashPassword(password);
						user.password = password;
						return user.save();
					}).then(function(user) {
						resolve(user);
					}, function(err) {
						reject(err);
					});
				});
			},
			resetPassword: function(email) {
				var restore_password_hash = '';
				return new sequelize.Promise(function(resolve, reject) {
					sequelize.db.User.findOne({
						where: {
							email: email
						}
					}).then(function(user) {
						if (!user)
							return reject('Can not find this email in our database');
						user.password_restore_code = sequelize.db.User.hashPassword("" + user.id + Math.random());
						restore_password_hash = sequelize.db.User.hashPassword(user.id + user.password_restore_code);
						return user.save();
					}).then(function(user) {
						mailer.sendTemplate('restore_password', user.email, {
							login: user.login,
							password_restore_code: user.password_restore_code,
							password_restore_hash: restore_password_hash
						});
						return resolve(user);
					}).catch(function(e) {
						return reject('Can not find this email in our database');
					});
				});
			},
			getByAuthCode: function(params, callback) {
				var params = params || {};
				var ip = params.ip || null;
				var auth_code = params.auth_code || null;

				return new sequelize.Promise(function(resolve, reject) {
					sequelize.db.Authentication.findOne({
						where: {
							auth_code: auth_code
						}
					}).then(function(authentication) {
						if (!authentication)
							return reject('Invalid auth code');
						return authentication.getUser();
					}).then(function(user) {
						user.activity_ip = ip;
						user.activity_date = Date.now() / 1000 | 0;
						user.save();
						return resolve(user);
					}).catch(function(e) {
						return reject('Invalid auth code');
					});
				});
			},
			signIn: function(params) {
				var params = params || {};
				var username = params.username || '';
				var password = params.password || '';

				password = this.hashPassword(password);

				return sequelize.db.User.findOne({
					where: {
						$or: [{
							login: username
						}, {
							email: username
						}],
						password: password
					}
				});
			}
		},
		instanceMethods: {
			auth: function(params) {
				var md5sum = crypto.createHash('md5');
				var hash = '' + md5sum.update('' + Math.random() + this.id).digest('hex');
				return this.createAuthentication({
					auth_code: hash
				});
			},
			signOut: function() {
				return sequelize.query("SELECT * FROM `authentications` WHERE user_id = :user_id", {
					replacements: {
						user_id: this.id
					}
				});
			},
			removeAccount: function() {
				var user = this;
				return new sequelize.Promise(function(resolve, reject) {
					user.remove_account_code = sequelize.db.User.hashPassword("del" + user.id + Math.random());
					user.save().then(function(user) {
						mailer.sendTemplate('remove_account', user.email, {
							login: user.login,
							remove_account_code: user.remove_account_code
						});
						return resolve(user);
					});
				});
			},
			removeAccountConfirm: function(code) {
				var user = this;
				return new sequelize.Promise(function(resolve, reject) {
					if (user.remove_account_code && user.remove_account_code == code)
						return user.destroy().then(function() {
							return resolve(true);
						});
					else
						return resolve(false);
				});
			},
			fillProfile: function(params) {
				var params = params || {};
				var login = params.login || '';
				var email = params.email || '';
				var password = params.password || '';
				var ip = params.ip || null;

				password = sequelize.db.User.hashPassword(password);

				if (this.is_demo) {
					this.login = login;
					this.email = email;
					this.password = password;
					this.is_demo = 0;
					this.registration_ip = ip;

					sequelize.db.WalletAccess.checkAccessForNewUser(this);
				} else
					return false;

				return this.save();
			},
			update: function(params) {
				var params = params || {};
				var password = params.password || '';
				var current_password = params.current_password || '';

				current_password = sequelize.db.User.hashPassword(current_password);
				if (current_password == this.password) {
					password = sequelize.db.User.hashPassword(password);
					this.password = password;
				} else {
					return false;
				}
				return this.save();
			},
			insertWallet: function(params) {
				var params = params || {};
				var name = params.name || '';
				var currency = params.currency || 'USD';

				return this.createWallet({
					name: name,
					currency: currency
				});
			},
			getSharedWallets: function() {
				return sequelize.query("SELECT wallets.* FROM wallets JOIN wallet_accesses ON wallet_accesses.wallet_id = wallets.id WHERE wallet_accesses.to_user_id = :user_id", {
					replacements: {
						user_id: this.id
					},
					model: sequelize.db.Wallet
				});
			},
			getUserPlans: function(id) {
				var where = {
					'user_id': this.id
				};
				if (typeof(id) !== 'undefined')
					where['id'] = id;

				return sequelize.db.Plan.findAll({
					attributes: ['id', 'user_id', 'name', 'goal_balance', 'goal_currency', 'goal_datetime', 'start_balance', 'start_currency', 'start_datetime', 'end_balance', 'status'],
					where: where,
					include: [{
						model: sequelize.db.Wallet,
						as: 'wallets',
						attributes: ['id', 'name', 'total'],
						through: {
							attributes: []
						}
					}]
				});
			},
			getUserPlan: function(id) {
				var user = this;
				return new sequelize.Promise(function(resolve, reject) {
					user.getUserPlans(id).then(function(plans) {
						if (plans.length > 0)
							resolve(plans[0]);
						else
							resolve(null);
					});
				});
			},
			addUserPlan: function(data) {
				var wallets_ids = data.wallets || [];
				var user = this;

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
								if (wallets[j].id == wallets_ids[k] && wallets[j].user_id == user.id)
									goodWalletsCount++;
						}

						if (goodWalletsCount != wallets_ids.length)
							throw "Invalid wallets ids";

						user.createPlan(data).then(function(plan) {
							plan.setWallets(wallets_ids).then(function() {
								return plan.setDefaultValues();
							}).then(function() {
								return plan.save();
							}).then(function(plan) {
								resolve(plan);
							});
						});
					});
				});
			},
			getWalletIfHasAccess: function(wallet_id) {
				return sequelize.db.WalletAccess.getWalletIfHasAccess(this, wallet_id);
			},
			getStats: function(params) {
				var user = this;
				var period = params.period || 'week';
				if (period != 'week' && period != 'month' && period != 'year')
					period = 'week';
				var utcOffset = params.utcOffset || 0;
				var wallet_id = params.wallet_id || null;

				return new sequelize.Promise(function(resolve, reject) {
					var now = moment();
					now.utcOffset(utcOffset);

					var retPeriods = [];
					var walletsCurrencies = {};

					var lowestTimestamp = now.unix();
					var highestTimestamp = now.unix();

					var count = 7; 
					if (period == 'month')
						count = 31;
					else if (period == 'year')
						count = 12;

					for (var i = 0; i < count; i++)
					{
						var newPeriod = {
							month: now.month() + 1, 
							year: now.year(),
							utcOffset: now.format('Z')
						};

						if (period == 'year')
							now.startOf('month');
						else {
							newPeriod.day = now.date();
							now.startOf('day');
						}
						newPeriod.fromTimestamp = now.unix(); // >=
						if (newPeriod.fromTimestamp < lowestTimestamp)
							lowestTimestamp = newPeriod.fromTimestamp;
						if (period == 'year')
							now.endOf('month');
						else
							now.endOf('day');
						newPeriod.toTimestamp = now.unix(); // <=
						if (newPeriod.toTimestamp > highestTimestamp)
							highestTimestamp = newPeriod.toTimestamp;

						if (period == 'year')
							now.subtract(1, 'months');
						else
							now.subtract(1, 'days');

						retPeriods.push(newPeriod);
					}


					user.getWallets().then(function(wallets){
						var foundWallet = false;
						if (wallets) {
							for (var k in wallets) {
								if ((wallet_id && wallets[k].id == wallet_id) || !wallet_id)
								{
									walletsCurrencies[wallets[k].id] = wallets[k].currency;
									foundWallet = true;
								}
							}
						}

						if (!foundWallet)
							return resolve(null);

						var allCurrencies = [];
						for (k in walletsCurrencies)
							if (allCurrencies.indexOf(walletsCurrencies[k]) == -1)
								allCurrencies.push(walletsCurrencies[k]);

						for (k in retPeriods) {
							retPeriods[k].stats = {};
							for (var ak in allCurrencies)
								retPeriods[k].stats[allCurrencies[ak]] = {
									expense: 0,
									profit: 0
								}
						};

						var where = {
								user_id: user.id,
								datetime: {
									$lte: highestTimestamp,
									$gte: lowestTimestamp
								}
							};
						if (wallet_id > 0)
							where.wallet_id = wallet_id;

						sequelize.db.Transaction.findAll({
							where: where
						}).then(function(transactions){
							if (transactions)
							for (var kt in transactions)
							for (var kp in retPeriods)
							{
								if (transactions[kt].datetime >= retPeriods[kp].fromTimestamp && transactions[kt].datetime <= retPeriods[kp].toTimestamp)
								{
									var currency = walletsCurrencies[transactions[kt].wallet_id];
									if (transactions[kt].amount < 0)
										retPeriods[kp].stats[currency].expense += Math.abs(transactions[kt].amount);
									else
										retPeriods[kp].stats[currency].profit += Math.abs(transactions[kt].amount);
								}
							}

							for (var k in retPeriods)
							{
								delete retPeriods[k].fromTimestamp;
								delete retPeriods[k].toTimestamp;
							}

							resolve(retPeriods);
						});
					});


				});
			}
		}
	});

	return User;
};