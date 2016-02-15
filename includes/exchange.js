var path = require('path');
var oxr = require('open-exchange-rates');
var fx = require('money');
var fs = require('fs');
var rfr = require('rfr');
var config = rfr('includes/config.js');

var openExchangeRatesAppId = config.openexchangerates.app_id || '';
var openExchangeRatesUpdateInterval = config.openexchangerates.update_interval || 86400;

if (config.openexchangerates.use_env_variable)
	openExchangeRatesAppId = process.env[openExchangeRatesAppId];

var cache_filename = path.join(__dirname, '..', 'data/cache/exchangerates.json');
var cached = null;

var reloadRates = function(callback) {
	if (!openExchangeRatesAppId)
		return false;

	oxr.latest(function() {
		cached = {};
		cached.rates = oxr.rates;
		cached.base = oxr.base;
		fs.writeFile(cache_filename, JSON.stringify(cached, null, 2));

		if (typeof(callback) === 'function')
			callback(cached);
	});
};

var reloadIfNeeded = function(callback) {
	fs.stat(cache_filename, function(err, stats) {
		if (!stats || (stats.mtime.getTime() / 1000) < (Date.now() / 1000 | 0) - openExchangeRatesUpdateInterval) {
			reloadRates(callback);
		}
	});
};

var cached = {
	rates: {},
	base: 'USD'
};

if (!openExchangeRatesAppId) {
	cached.error = 'Please specify openexchangerates app_id in config/config.json. Without it, dimeshift will not be able to do currency conversions';
	console.error(cached.error);
} else {
	oxr.set({
		app_id: openExchangeRatesAppId
	});

	try {
		cached = JSON.parse("" + fs.readFileSync(cache_filename, 'utf8'));
	} catch (e) {
		console.log("No cached exchange rates\n");
	}

	if (cached && typeof(cached.rates) !== 'undefined' && typeof(cached.base) !== 'undefined') {
		fx.rates = cached.rates;
		fx.base = cached.base;

		reloadIfNeeded();
	} else {
		reloadRates(function() {
			fx.rates = cached.rates;
			fx.base = cached.base;
		});
	}
}

var getRates = function() {
	console.log(cached);
	reloadIfNeeded();
	return cached;
};

exports.fx = fx;
exports.getRates = getRates;
// fx(100).from('HKD').to('GBP'); // ~8.0424