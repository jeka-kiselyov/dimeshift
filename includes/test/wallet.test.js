var hippie = require('hippie');
var rfr = require('rfr');
var expect = require('chai').expect;
var assert = require('chai').assert;
var testHelper = rfr('includes/test.js');

describe('API server', function() {

	/// Data for user registration
	var email = 'email' + Math.random() + '@example.com';
	var login = 'login' + Math.random();
	var password = 'password' + Math.random();
	var registeredUserId = null;
	var auth_code = null;

	var wallet_1_name = 'name ' + Math.random();
	var wallet_1_currency = 'USD';
	var wallet_1_id = null;
	var wallet_1_initial_amount = 200.99;

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

			expect(data.cookies.is_logged_in_user).to.be.ok;
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

	it('returns empty wallets list for new (not demo) user', function(done) {
		testHelper.sendGet('/api/wallets').then(function(data) {
			expect(data.body).to.be.a('array');
			expect(data.body).to.have.length(0);
			done();
		});
	});

	it('allows him to sign out', function(done) {
		testHelper.sendPost('/api/users/signout', null).then(function(data) {
			done();
		});
	});

	it('does not show signed out user info', function(done) {
		testHelper.sendGetAndExpectStatus('/api/users', 500).then(function() {
			done();
		});
	});

	it('allows him to sign in', function(done) {
		testHelper.sendPost('/api/users/signin', {
			username: login,
			password: password
		}).then(function(data) {
			expect(data.cookies.is_logged_in_user).to.be.ok;
			expect(data.cookies.logged_in_user).to.equal(data.body.auth_code);
			expect(data.body.id).to.equal(registeredUserId);

			auth_code = data.body.auth_code;

			done();
		});
	});

	it('allows to confirm that user is signed in', function(done) {
		testHelper.sendGet('/api/users').then(function(data) {
			expect(data.body.id).to.be.a('number');
			expect(data.body.id).to.equal(registeredUserId);
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

	it('returns updated wallets list', function(done) {
		testHelper.sendGet('/api/wallets').then(function(data) {
			expect(data.body).to.be.a('array');
			expect(data.body).to.have.length(1);
			expect(data.body[0].id).to.equal(wallet_1_id);
			expect(data.body[0].name).to.equal(wallet_1_name);
			expect(data.body[0].status).to.equal('active');
			expect(data.body[0].origin).to.equal('mine');
			expect(data.body[0].currency).to.equal(wallet_1_currency);

			done();
		});
	});

	it('lets us edit wallet name and currency', function(done) {
		wallet_1_name = wallet_1_name + '_updated';
		wallet_1_currency = 'EUR';
		testHelper.sendPut('/api/wallets/' + wallet_1_id, {
			name: wallet_1_name,
			currency: wallet_1_currency
		}).then(function(data) {
			expect(data.body.name).to.equal(wallet_1_name);
			expect(data.body.currency).to.equal(wallet_1_currency);
			done();
		});
	});

	it('lets us add some income transaction to wallet', function(done) {
		testHelper.sendPost('/api/wallets/' + wallet_1_id + '/transactions/', {
			wallet_id: wallet_1_id,
			amount: wallet_1_initial_amount,
			description: 'Initial'
		}).then(function(data) {
			expect(data.body).to.be.a('object');
			expect(data.body.amount).to.equal(wallet_1_initial_amount);
			expect(data.body.wallet_id).to.equal(wallet_1_id);
			expect(data.body.user_id).to.equal(registeredUserId);
			expect(data.body.description).to.equal('Initial');

			done();
		});
	});

	it('updates wallet total with transactions', function(done) {
		testHelper.sendGet('/api/wallets/' + wallet_1_id).then(function(data) {
			expect(data.body).to.be.a('object');
			expect(data.body.total).to.equal(wallet_1_initial_amount);
			done();
		});
	});


	var testTransactions = [];
	testTransactions.push({
		amount: -0.99,
		shouldSetTotalTo: wallet_1_initial_amount - 0.99
	});
	testTransactions.push({
		amount: -400,
		shouldSetTotalTo: wallet_1_initial_amount - 0.99 - 400
	});
	testTransactions.push({
		amount: 1200,
		shouldSetTotalTo: wallet_1_initial_amount - 0.99 - 400 + 1200
	});
	testTransactions.push({
		subtype: 'setup',
		amount: 89.99,
		shouldSetTotalTo: 89.99 //// setup transaction set wallet total to its amount
	});

	testTransactions.forEach(function(testTransaction) {
		it('lets us add another sample transaction', function(done) {
			var data = {
				wallet_id: wallet_1_id,
				amount: testTransaction.amount,
				description: 'fasd'
			};
			if (typeof(testTransaction.subtype) !== 'undefined')
				data.subtype = testTransaction.subtype;

			testHelper.sendPost('/api/wallets/' + wallet_1_id + '/transactions/', data).then(function(data) {
				expect(data.body).to.be.a('object');
				if (data.body.subtype === 'confirmed')
					expect(data.body.amount).to.equal(testTransaction.amount);
				done();
			});
		});

		it('updates wallet total with sample transactions', function(done) {
			testHelper.sendGet('/api/wallets/' + wallet_1_id).then(function(data) {
				expect(data.body).to.be.a('object');
				expect(data.body.total).to.equal(testTransaction.shouldSetTotalTo);
				done();
			});
		});
	});

	it('does not allow to remove wallet instantly', function(done) {
		testHelper.sendDeleteAndExpectStatus('/api/wallets/' + wallet_1_id, '!200').then(function(data) {
			done();
		});
	});

	it('hides wallet with PUT method', function(done) {
		testHelper.sendPut('/api/wallets/' + wallet_1_id, {
			status: 'hidden'
		}).then(function(data) {
			expect(data.body.status).to.equal('hidden');
			done();
		});
	});

	it('allow to remove hidden wallet', function(done) {
		testHelper.sendDelete('/api/wallets/' + wallet_1_id).then(function(data) {
			expect(data.body).to.equal(true);
			done();
		});
	});

	it('returns empty wallets list now, as we have removed the only wallet', function(done) {
		testHelper.sendGet('/api/wallets').then(function(data) {
			expect(data.body).to.be.a('array');
			expect(data.body).to.have.length(0);
			done();
		});
	});

});
// var sendTestPost = function(endpoint, data, callback) {
// 	hippie()
// 		.json()
// 		.base('http://localhost:8080')
// 		.timeout(5000)
// 		.post(endpoint)
// 		.send(data)
// 		.expectStatus(200)
// 		.use(persistCookies)
// 		.end(function(err, res, body) {
// 			if (err) throw err;

// 			var headers = res.headers;

// 			// var cookieHeader = res.headers['set-cookie'];
// 			// res.cookies = {};
// 			// cookieHeader && cookieHeader.forEach(function(cookie) {
// 			// 	var parts = cookie.split('=');
// 			// 	res.cookies[parts.shift().trim()] = decodeURI(parts.join('=').split('; ')[0]);
// 			// });

// 			expect(body).to.be.an('object');

// 			if (typeof(callback) === 'function')
// 				callback(body, headers);
// 		});
// };

// var sendTestGet = function(endpoint, data, callback) {
// 	hippie()
// 		.json()
// 		.base('http://localhost:8080')
// 		.timeout(5000)
// 		.get(endpoint)
// 		.expectStatus(200)
// 		.use(persistCookies)
// 		.end(function(err, res, body) {
// 			if (err) throw err;

// 			var headers = res.headers;

// 			expect(body).to.be.an('object');

// 			if (typeof(callback) === 'function')
// 				callback(body, headers);
// 		});
// };

// var persistCookies = function(opts, next) {
// 	opts.jar = true;
// 	next(opts);
// };