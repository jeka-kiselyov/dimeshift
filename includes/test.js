var hippie = require('hippie');
var expect = require('chai').expect;
var Sequelize = require('sequelize');

var base = 'http://localhost:8080';
var timeout = 500;

var prepareResolve = function(err, res, body, resolve) {
	if (err) throw err;
	var headers = res.headers;
	var cookies = {};

	if (typeof(headers['set-cookie']) !== 'undefined' && headers['set-cookie']) {
		headers['set-cookie'].forEach(function(cookie) {
			var parts = cookie.split('=');
			cookies[parts.shift().trim()] = decodeURI(parts.join('=').split('; ')[0]);
		});
	}

	var bodyTypeIsGood = false;
	if (Array.isArray(body) || (typeof body === 'object' && Object.prototype.toString.call(body) === '[object Array]'))
		bodyTypeIsGood = true;
	else if (body !== null && typeof body === 'object')
		bodyTypeIsGood = true;
	else if (typeof body === 'boolean')
		bodyTypeIsGood = true;

	expect(bodyTypeIsGood).to.equal(true, "Invalid response body. Should be one of(array, object, boolean)");
	resolve({
		body: body,
		headers: headers,
		cookies: cookies
	});
};

var prepareResolveStatus = function(err, res, body, resolve, status) {
	var resStatus = 0;
	if (typeof res !== 'undefined' && typeof res.statusCode !== 'undefined')
		resStatus = res.statusCode;
	if (typeof(status) === 'string' && status.substr(0, 1) === '!') {
		var statusToNotExpect = parseInt(status.split('!').join(''), 10);
		if (statusToNotExpect == resStatus) {
			console.error("Body:");
			console.error(body);
		}
		expect(resStatus).to.not.equal(statusToNotExpect, "Invalid response status code");
	} else {
		var statusToExpect = parseInt(status, 10);
		if (statusToExpect != resStatus) {
			console.error("Body:");
			console.error(body);
		}
		expect(resStatus).to.equal(statusToExpect, "Invalid response status code");
	}
	resolve({
		body: body
	});
};

var prepareHippie = function(method, endpoint, data) {
	var hippieCall = hippie()
		.json()
		.base(base)
		.timeout(timeout)
		.use(persistCookies);

	if (method == 'post') {
		return hippieCall.post(endpoint).send(data);
	} else if (method == 'delete' || method == 'del') {
		return hippieCall.del(endpoint);
	} else if (method == 'put') {
		return hippieCall.put(endpoint).send(data);
	} else
		return hippieCall.get(endpoint);
}

var sendPostAndExpectStatus = function(endpoint, data, status) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('post', endpoint, data)
			.end(function(err, res, body) {
				prepareResolveStatus(err, res, body, resolve, status);
			});
	});
};

var sendPost = function(endpoint, data) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('post', endpoint, data)
			.end(function(err, res, body) {
				prepareResolve(err, res, body, resolve);
			});
	});
};

var sendGetAndExpectStatus = function(endpoint, status) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('get', endpoint)
			.end(function(err, res, body) {
				prepareResolveStatus(err, res, body, resolve, status);
			});
	});
};

var sendGet = function(endpoint) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('get', endpoint)
			.end(function(err, res, body) {
				prepareResolve(err, res, body, resolve);
			});
	});
};

var sendDeleteAndExpectStatus = function(endpoint, status) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('del', endpoint)
			.end(function(err, res, body) {
				prepareResolveStatus(err, res, body, resolve, status);
			});
	});
};

var sendDelete = function(endpoint) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('del', endpoint)
			.end(function(err, res, body) {
				prepareResolve(err, res, body, resolve);
			});
	});
};

var sendPut = function(endpoint, data) {
	return new Sequelize.Promise(function(resolve, reject) {
		prepareHippie('put', endpoint, data)
			.end(function(err, res, body) {
				prepareResolve(err, res, body, resolve);
			});
	});
};

var persistCookies = function(opts, next) {
	opts.jar = true;
	next(opts);
};

exports.sendPost = sendPost;
exports.sendGet = sendGet;
exports.sendPut = sendPut;
exports.sendDelete = sendDelete;
exports.sendPostAndExpectStatus = sendPostAndExpectStatus;
exports.sendGetAndExpectStatus = sendGetAndExpectStatus;
exports.sendDeleteAndExpectStatus = sendDeleteAndExpectStatus;