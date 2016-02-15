// exchange.js
App.exchange = {
	rates: {},
	base: 'USD',
	loaded: false,
	loadRates: function(callback) {
		// @todo: reload exchange rates once per hour
		if (this.loaded) {
			if (typeof(callback) == 'function')
				callback();
			return;
		}
		var that = this;

		var process = function(data) {

			if (typeof(data.rates) === 'undefined' || typeof(data.base) === 'undefined') {
				console.error('Invalid api/exchange/rates rasponse. Maybe you need to check openexchangerates api_key in server settings');
				return;
			}
			that.rates = data.rates;
			that.base = data.base;

			that.loaded = true;
			if (typeof(callback) == 'function')
				callback();
		};

		$.ajax({
			url: App.settings.apiEntryPoint + 'exchange/rates',
			data: {},
			success: process,
			dataType: 'json',
			mimeType: 'application/json',
			cache: false
		});
	},
	convert: function(value, from, to) {
		return value * this.getRate(to, from);
	},
	getRate: function(to, from) {
		this.rates[this.base] = 1;

		if (!this.rates[to] || !this.rates[from]) {
			console.error('No exchange rates FROM:' + from + ' TO:' + to + '. Converting by 1:1');
			return 1;
		}

		if (from === this.base) {
			return this.rates[to];
		}
		if (to === this.base) {
			return 1 / this.rates[from];
		}

		return this.rates[to] * (1 / this.rates[from]);
	}

};