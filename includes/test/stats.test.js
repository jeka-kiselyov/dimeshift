var hippie = require('hippie');
var rfr = require('rfr');
var expect = require('chai').expect;
var assert = require('chai').assert;
var testHelper = rfr('includes/test.js');
var db = rfr('includes/models');

describe('API server for statistics', function() {

	var email = 'email' + Math.random() + '@example.com';
	var login = 'login' + Math.random();
	var password = 'password' + Math.random();
	var registeredUserId = null;
	var auth_code = null;

	var wallet_1_name = 'name ' + Math.random();
	var wallet_1_currency = 'USD';
	var wallet_1_id = null;

	var wallet_2_name = 'name ' + Math.random();
	var wallet_2_currency = 'UAH';
	var wallet_2_id = null;

	it('registers user', function(done) {
		testHelper.sendPost('/api/users', {
			email: email,
			login: login,
			password: password
		}).then(function(data) {
			expect(data.body.id).to.be.a('number');

			registeredUserId = data.body.id;
			auth_code = data.body.auth_code;

			done();
		});
	});

	it('adds new wallet', function(done) {
		testHelper.sendPost('/api/wallets', {
			name: wallet_1_name,
			currency: wallet_1_currency
		}).then(function(data) {
			wallet_1_id = data.body.id;
			done();
		});
	});

	it('adds new wallet', function(done) {
		testHelper.sendPost('/api/wallets', {
			name: wallet_2_name,
			currency: wallet_2_currency
		}).then(function(data) {
			wallet_2_id = data.body.id;
			done();
		});
	});

	it('lets us add some income transaction to wallet', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_1_id + '/transactions/', {
			wallet_id: wallet_1_id,
			amount: 10,
			description: 'Initial'
		}).then(function(data) {
			done();
		});
	});

	it('lets us add some expense transaction to wallet', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_1_id + '/transactions/', {
			wallet_id: wallet_1_id,
			amount: -99,
			description: 'Initial'
		}).then(function(data) {
			done();
		});
	});

	it('lets us add some income transaction to wallet 2', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_2_id + '/transactions/', {
			wallet_id: wallet_2_id,
			amount: 99,
			description: 'Initial'
		}).then(function(data) {
			done();
		});
	});

	it('lets us add some income transaction to wallet 2', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_2_id + '/transactions/', {
			wallet_id: wallet_2_id,
			amount: 99,
			description: 'Initial'
		}).then(function(data) {
			done();
		});
	});

	it('gets week transactions', function(done) {
		testHelper.sendGet('/api/stats/week?utcoffset=-3').then(function(data) {


			expect(data.body).to.have.length(7);
			expect(data.body[0].stats).to.be.an('object');
			expect(data.body[0].stats[wallet_1_currency]).to.be.an('object');
			expect(data.body[0].stats[wallet_2_currency]).to.be.an('object');

			expect(data.body[0].stats[wallet_1_currency].expense).to.equal(99);
			expect(data.body[0].stats[wallet_2_currency].expense).to.equal(0);
			expect(data.body[0].stats[wallet_1_currency].profit).to.equal(10);
			expect(data.body[0].stats[wallet_2_currency].profit).to.equal(198);


			done();
		});
	});

	it('gets by wallet week transactions', function(done) {
		testHelper.sendGet('/api/wallets/'+wallet_1_id+'/stats/week?utcoffset=-3').then(function(data) {


			expect(data.body).to.have.length(7);
			expect(data.body[0].stats).to.be.an('object');
			expect(data.body[0].stats[wallet_1_currency]).to.be.an('object');

			expect(data.body[0].stats[wallet_1_currency].expense).to.equal(99);
			expect(data.body[0].stats[wallet_1_currency].profit).to.equal(10);


			done();
		});
	});

	it('gets by wallet2 week transactions', function(done) {
		testHelper.sendGet('/api/wallets/'+wallet_2_id+'/stats/week?utcoffset=-3').then(function(data) {
			expect(data.body).to.have.length(7);
			expect(data.body[0].stats).to.be.an('object');
			expect(data.body[0].stats[wallet_2_currency]).to.be.an('object');

			expect(data.body[0].stats[wallet_2_currency].expense).to.equal(0);
			expect(data.body[0].stats[wallet_2_currency].profit).to.equal(198);
console.log(data.body);
console.log(data.body[0]);
			done();
		});
	});

	it('shoud not return others wallets stats', function(done) {
		testHelper.sendGetAndExpectStatus('/api/wallets/1/stats/week?utcoffset=-3', "!200").then(function() {
			done();
		});
	});


	it('gets year transactions', function(done) {
		testHelper.sendGet('/api/stats/year?utcoffset=-3').then(function(data) {


			expect(data.body).to.have.length(12);
			expect(data.body[0].stats).to.be.an('object');
			expect(data.body[0].stats[wallet_1_currency]).to.be.an('object');
			expect(data.body[0].stats[wallet_2_currency]).to.be.an('object');

			expect(data.body[0].stats[wallet_1_currency].expense).to.equal(99);
			expect(data.body[0].stats[wallet_2_currency].expense).to.equal(0);
			expect(data.body[0].stats[wallet_1_currency].profit).to.equal(10);
			expect(data.body[0].stats[wallet_2_currency].profit).to.equal(198);


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
			done();
		});
	});

});