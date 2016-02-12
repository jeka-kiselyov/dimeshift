var hippie = require('hippie');
var rfr = require('rfr');
var expect = require('chai').expect;
var assert = require('chai').assert;
var testHelper = rfr('includes/test.js');
var db = rfr('includes/models');

describe('API server for planning', function() {
	/// Data for user registration
	var email = 'email' + Math.random() + '@example.com';
	var login = 'login' + Math.random();
	var password = 'password' + Math.random();
	var registeredUserId = null;
	var auth_code = null;

	var wallet_1_name = 'name ' + Math.random();
	var wallet_1_currency = 'UAH';
	var wallet_1_id = null;
	var wallet_1_initial_amount = 200.99;

	var wallet_2_name = 'name2 ' + Math.random();
	var wallet_2_currency = 'USD';
	var wallet_2_id = null;
	var wallet_2_initial_amount = 100.99;

	var plan_1_name = 'Test Name';
	var plan_1_currency = 'UAH';
	var plan_1_goal_balance = 1000;
	var plan_1_goal_datetime = (Date.now() / 1000 | 0) + 60 * 24 * 60 * 60;

	var plan_1_id = null;
	var plan_1 = null;

	it('registers user', function(done) {
		testHelper.sendPost('/api/users', {
			email: email,
			login: login,
			password: password
		}).then(function(data) {
			expect(data.body.id).to.be.a('number');
			expect(data.body.email).to.be.a('string');
			expect(data.body.email).to.equal(email);
			expect(data.body.login).to.be.a('string');
			expect(data.body.login).to.equal(login);
			expect(data.body.auth_code).to.be.a('string');

			assert.ok(data.cookies.is_logged_in_user);
			expect(data.cookies.logged_in_user).to.equal(data.body.auth_code);

			registeredUserId = data.body.id;
			auth_code = data.body.auth_code;

			done();
		});
	});

	it('signs him in on registration', function(done) {
		testHelper.sendGet('/api/users').then(function(data) {
			expect(data.body.id).to.be.a('number');
			expect(data.body.id).to.equal(registeredUserId);
			done();
		});
	});

	it('returns empty plans list for new user', function(done) {
		testHelper.sendGet('/api/plans').then(function(data) {
			expect(data.body).to.be.a('array');
			expect(data.body).to.have.length(0);
			done();
		});
	});

	it('adds new wallet', function(done) {
		testHelper.sendPost('/api/wallets', {
			name: wallet_1_name,
			currency: wallet_1_currency
		}).then(function(data) {
			expect(data.body.user_id).to.equal(registeredUserId);
			expect(data.body.name).to.equal(wallet_1_name);
			expect(data.body.total).to.equal(0);
			expect(data.body.status).to.equal('active');
			expect(data.body.currency).to.equal(wallet_1_currency);

			wallet_1_id = data.body.id;
			done();
		});
	});

	it('lets us add some income transaction to wallet', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_1_id + '/transactions/', {
			wallet_id: wallet_1_id,
			amount: wallet_1_initial_amount,
			description: 'Initial'
		}).then(function(data) {
			expect(data.body.amount).to.equal(wallet_1_initial_amount);

			done();
		});
	});

	it('allow to create new plan', function(done) {
		var newData = {
			name: plan_1_name,
			goal_currency: plan_1_currency,
			goal_balance: plan_1_goal_balance,
			goal_datetime: plan_1_goal_datetime,
			wallets: [wallet_1_id]
		};

		testHelper.sendPost('/api/plans', newData).then(function(data) {
			expect(data.body.user_id).to.equal(registeredUserId);
			expect(data.body.name).to.equal(newData.name);
			expect(data.body.goal_currency).to.equal(newData.goal_currency);
			expect(data.body.start_currency).to.equal(newData.goal_currency);
			expect(data.body.goal_balance).to.equal(newData.goal_balance);

			expect(data.body.goal_datetime).to.equal(plan_1_goal_datetime);

			expect(data.body.wallets).to.be.a('array');
			expect(data.body.wallets).to.have.length(1);

			expect(data.body.wallets[0].id).to.equal(wallet_1_id);

			/// start_balance should be calculated from wallets
			expect(data.body.start_balance).to.equal(wallet_1_initial_amount);

			plan_1_id = data.body.id;
			plan_1 = data.body;

			done();
		});
	});


	it('allow to edit plan', function(done) {
		plan_1_name = plan_1_name + 'updated';
		plan_1_currency = 'USD';
		plan_1_goal_balance = 2000;
		plan_1_goal_datetime = plan_1_goal_datetime + 60 * 24 * 60 * 60; // 120 days total

		var newData = {
			name: plan_1_name,
			goal_currency: plan_1_currency,
			goal_balance: plan_1_goal_balance,
			goal_datetime: plan_1_goal_datetime,
			wallets: [wallet_1_id]
		};

		testHelper.sendPut('/api/plans/' + plan_1_id, newData).then(function(data) {
			expect(data.body.user_id).to.equal(registeredUserId);

			/// Updated fields
			expect(data.body.name).to.equal(newData.name);
			expect(data.body.goal_currency).to.equal(newData.goal_currency);
			expect(data.body.goal_balance).to.equal(newData.goal_balance);
			expect(data.body.goal_datetime).to.equal(plan_1_goal_datetime);

			// Kept fields
			expect(data.body.wallets).to.be.a('array');
			expect(data.body.wallets).to.have.length(1);
			expect(data.body.wallets[0].id).to.equal(wallet_1_id);

			expect(data.body.start_currency).to.equal(plan_1.start_currency);
			expect(data.body.start_balance).to.equal(plan_1.start_balance);
			expect(data.body.start_datetime).to.equal(plan_1.start_datetime);

			plan_1 = data.body;

			done();
		});
	});

	it('adds another new wallet', function(done) {
		testHelper.sendPost('/api/wallets', {
			name: wallet_2_name,
			currency: wallet_2_currency
		}).then(function(data) {
			expect(data.body.user_id).to.equal(registeredUserId);
			expect(data.body.name).to.equal(wallet_2_name);
			expect(data.body.total).to.equal(0);
			expect(data.body.status).to.equal('active');
			expect(data.body.currency).to.equal(wallet_2_currency);

			wallet_2_id = data.body.id;
			done();
		});
	});


	it('allow to edit plan, adding another wallets to it', function(done) {

		var newData = {
			wallets: [wallet_1_id, wallet_2_id]
		};

		testHelper.sendPut('/api/plans/' + plan_1_id, newData).then(function(data) {
			expect(data.body.user_id).to.equal(registeredUserId);

			/// Updated fields
			expect(data.body.wallets).to.be.a('array');
			expect(data.body.wallets).to.have.length(2);

			var found_wallet_1 = false;
			var found_wallet_2 = false;
			for (var k in data.body.wallets) {
				if (data.body.wallets[k].id == wallet_1_id)
					found_wallet_1 = true;
				if (data.body.wallets[k].id == wallet_2_id)
					found_wallet_2 = true;
			}

			assert.ok(found_wallet_1);
			assert.ok(found_wallet_2);

			// Kept fields
			expect(data.body.name).to.equal(plan_1.name);
			expect(data.body.goal_currency).to.equal(plan_1.goal_currency);
			expect(data.body.goal_balance).to.equal(plan_1.goal_balance);
			expect(data.body.goal_datetime).to.equal(plan_1.goal_datetime);
			expect(data.body.start_currency).to.equal(plan_1.start_currency);
			expect(data.body.start_balance).to.equal(plan_1.start_balance);
			expect(data.body.start_datetime).to.equal(plan_1.start_datetime);

			plan_1 = data.body;

			done();
		});
	});

	var remove_account_code = null;

	it('allow to initialize remove account procedure for signed in user', function(done) {
		testHelper.sendPostAndExpectStatus('/api/users/' + registeredUserId + '/removeaccount', {}, '200').then(function(data) {
			expect(data.body).to.equal(true);

			db.User.findOne({
				where: {
					id: registeredUserId
				}
			}).then(function(user) {

				expect(registeredUserId).to.equal(user.id);
				remove_account_code = user.remove_account_code;

				done();
			});
		});
	});

	it('allow to finish remove account procedure', function(done) {
		testHelper.sendPostAndExpectStatus('/api/users/' + registeredUserId + '/removeaccount', {
			code: remove_account_code
		}, '200').then(function(data) {
			expect(data.body).to.equal(true);

			/// double check that user is removed
			db.User.findOne({
				where: {
					id: registeredUserId
				}
			}).then(function(user) {
				expect(user).to.equal(null);
				done();
			});
		});
	});

});