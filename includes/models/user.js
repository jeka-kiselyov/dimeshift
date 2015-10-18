var crypto 	= require('crypto');
var rfr 	= require('rfr');
var demo 	= rfr('includes/demo.js');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		email: { type: DataTypes.STRING(255), validate: {
			isEmail: { msg: "Invalid email" }
		} },
		type: { type: DataTypes.STRING(20), defaultValue: 'default', validate: {
			isIn: { args: [['default', 'facebook']], msg: "Invalid user type" }
		} },
		password: DataTypes.STRING(50),
		login: DataTypes.STRING(255),
		is_demo: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false},
		is_admin: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false},
		registration_date: DataTypes.INTEGER,
		activity_date: DataTypes.INTEGER,
		registration_ip: DataTypes.STRING(20),
		activity_ip: DataTypes.STRING(20),
		confirmation_code: DataTypes.STRING(255),
		password_restore_code: DataTypes.STRING(255),
		is_banned: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
	},
	{
		timestamps: false,
		freezeTableName: true,
		tableName: 'users',
		classMethods: {
			hashPassword: function(password)
			{
				return crypto.createHash('md5').update(password+'password_salt').digest("hex");
			},
			register: function(params)
			{
				var params = params || {};
				var type = params.type || 'default';
				var login = params.login || '';
				var password = params.password || '';
				var email = params.email || '';
				var is_demo = false;

				if (email == 'demo@demo.com')
				{
					email = 'email'+Math.random()+'@example.com';
					login = 'login'+Math.random();
					password = 'password'+Math.random();
					type = 'default';
					is_demo = true;
				}

				password = this.hashPassword(password);

				return new sequelize.Promise(function(resolve, reject) {
					var user = sequelize.db.User.build({ type: type, email: email, login: login, password: password });
					user.registration_date = Date.now() / 1000 | 0;
					user.registration_ip = '';
					user.is_demo = is_demo;

					user.save().then(function(user) {
						if (is_demo)
						{
							demo.fillDemoAccount(user).then(function(){
								resolve(user);
							});
						} 
						else
							resolve(user);
					}, function(err) {
						reject(err);
					});
				});

			},
			registerDemo: function(params, callback)
			{

			},
			getByAuthCode: function(auth_code, callback)
			{
				return new sequelize.Promise(function(resolve, reject) {
					sequelize.db.Authentication.findOne({
						where: {auth_code: auth_code}
					}).then(function(authentication){
						if (!authentication)
							return reject('Invalid auth code');
						return authentication.getUser();						
					}).then(function(user){
						return resolve(user);
					}).catch(function(e){
						return reject('Invalid auth code');
					});
				});
			},
			signIn: function(params)
			{
				var params = params || {};
				var username = params.username || '';
				var password = params.password || '';

				password = this.hashPassword(password);

				return sequelize.db.User.findOne({
					where: { $or: [{login: username}, {email: username}], password: password }
				});
			}
		},
		instanceMethods: {
			auth: function()
			{
				var md5sum = crypto.createHash('md5');
				var hash = '' + md5sum.update(''+Math.random()+this.id).digest('hex');
				return this.createAuthentication({auth_code: hash});
			},
			signOut: function()
			{
				return sequelize.query("SELECT * FROM `authentications` WHERE user_id = :user_id",
					{ replacements: { user_id: this.id } });
			},
			fillProfile: function(params)
			{
				var params = params || {};
				var login = params.login || '';
				var email = params.email || '';
				var password = params.password || '';

				password = sequelize.db.User.hashPassword(password);

				if (this.is_demo)
				{
					this.login = login;
					this.email = email;
					this.password = password;
					this.is_demo = false;
				} else
				return false;

				return this.save();
			},
			update: function(params)
			{
				var params = params || {};
				var password = params.password || '';
				var current_password = params.current_password || '';

				current_password = sequelize.db.User.hashPassword(current_password);
				if (current_password == this.password)
				{
					password = sequelize.db.User.hashPassword(password);
					this.password = password;
				} else {
					return false;
				}
				return this.save();
			},
			insertWallet: function(params)
			{
				var params = params || {};
				var name = params.name || '';
				var currency = params.currency || 'USD';

				return this.createWallet({name: name, currency: currency});
			}
		}
	});

	return User;
};