// plan.js
App.Models.Plan = Backbone.Model.extend({

	defaults: {
		name: null,
	},
	loadedWallets: [],
	transactions: {},
	stats: [],
	walletsCurrencies: {},
	areStatsReady: false,
	url: function() {
		return App.settings.apiEntryPoint + 'plans/' + (typeof(this.id) === 'undefined' ? '' : this.id);
	},
	getPlanForToday: function() {
		var today = new Date();
		return this.getPlanForTheDay(today.getDate(), today.getMonth() + 1, today.getFullYear());
	},
	getPlanForTheDay: function(day, month, year) {
		if (!this.areStatsReady)
			throw 'call getPlanForTheDay only when stats are ready';

		// @todo: cache index
		for (var di = 0; di < this.stats.length; di++) {
			if (this.stats[di].date.day == day && this.stats[di].date.month == month && this.stats[di].date.year == year) {
				return this.stats[di].allowedToSpend;
			}
		}

		return null;
	},
	getStats: function() {
		var deferred = jQuery.Deferred();

		if (this.areStatsReady) {
			this.trigger('statsready');
			deferred.resolve(this.stats);
			return deferred;
		}

		var cached = App.localStorage.get('plan_' + this.id + '_data');
		if (cached !== null && cached !== undefined) {
			var cachedDate = new Date(1000 * cached.saved);
			var curDate = new Date();

			if (cachedDate.getMonth() == curDate.getMonth() && cachedDate.getDate() == curDate.getDate() && cachedDate.getFullYear() == curDate.getFullYear()) {
				console.log('plan.js | restore stats from cache');
				this.stats = cached.stats;
				this.areStatsReady = true;
				this.trigger('statsready');
				deferred.resolve(this.stats);
				return deferred;
			} else {
				console.log('plan.js | cache is too old');
			}
		}

		var plan = this;
		var daysCount = Math.ceil((this.get('goal_datetime') - this.get('start_datetime')) / (24 * 60 * 60));
		this.stats = [];

		for (var i = 0; i < daysCount; i++) {
			var dayStat = {};
			dayStat.date = {};
			dayStat.date.unix = (this.get('start_datetime') + 24 * 60 * 60 * i);
			dayStat.date.date = new Date(1000 * dayStat.date.unix);
			dayStat.date.month = dayStat.date.date.getMonth() + 1;
			dayStat.date.year = dayStat.date.date.getFullYear();
			dayStat.date.day = dayStat.date.date.getDate();
			dayStat.date.unix_from = (new Date(dayStat.date.year, dayStat.date.month - 1, dayStat.date.day, 0, 0, 0, 0)).getTime() / 1000;
			dayStat.date.unix_to = dayStat.date.unix_from + 24 * 60 * 60;
			dayStat.expenses = {};
			dayStat.expensesTotal = 0;
			dayStat.profits = {};
			dayStat.profitsTotal = 0;
			dayStat.dayTotal = 0;

			this.stats.push(dayStat);
		}

		this.once('walletsloadded', function() {

			for (var wk in plan.loadedWallets)
				plan.walletsCurrencies[plan.loadedWallets[wk].id] = plan.loadedWallets[wk].get('currency');

			for (var di = 0; di < plan.stats.length; di++) {
				for (var tk in plan.transactions) {
					plan.stats[di].expenses[tk] = 0;
					plan.stats[di].profits[tk] = 0;
				}
			}
			/// get spending per day
			for (var di = 0; di < plan.stats.length; di++) {
				for (var tk in plan.transactions) {
					for (var wti = 0; wti < plan.transactions[tk].length; wti++) {
						if (plan.transactions[tk][wti].get('datetime') >= plan.stats[di].date.unix_from && plan.transactions[tk][wti].get('datetime') < plan.stats[di].date.unix_to) {

							var absInWalletCurrency = Math.abs(plan.transactions[tk][wti].get('amount'));
							var absInGoalCurrency = App.exchange.convert(absInWalletCurrency, plan.walletsCurrencies[tk], plan.get('goal_currency'));
							if (plan.transactions[tk][wti].get('amount') < 0) {
								// expense
								plan.stats[di].expenses[tk] += absInGoalCurrency;
								plan.stats[di].expensesTotal += absInGoalCurrency;
								plan.stats[di].dayTotal -= absInGoalCurrency;
							} else {
								// profit
								plan.stats[di].profits[tk] += absInGoalCurrency;
								plan.stats[di].profitsTotal += absInGoalCurrency;
								plan.stats[di].dayTotal += absInGoalCurrency;
							}
						}
					}
				}
			}

			var currentTotal = App.exchange.convert(plan.get('start_balance'), plan.get('start_currency'), plan.get('goal_currency'));
			var goalTotal = plan.get('goal_balance');
			for (var di = 0; di < plan.stats.length; di++) {
				plan.stats[di].currentTotalOnStart = currentTotal;
				plan.stats[di].allowedToSpend = (goalTotal - currentTotal) / (plan.stats.length - di);
				currentTotal += plan.stats[di].dayTotal;
				plan.stats[di].currentTotalOnEnd = currentTotal;
			}

			plan.areStatsReady = true;

			App.localStorage.set('plan_' + plan.id + '_data', {
				stats: plan.stats,
				saved: (new Date().getTime() / 1000)
			});

			plan.trigger('statsready');
			deferred.resolve(plan.stats);
		});

		this.loadWallets();
		return deferred;
	},
	loadWallets: function() {
		var plan = this;
		var wallets = this.get('wallets');
		for (var k in wallets) {
			var wallet = new App.Models.Wallet();
			wallet.id = wallets[k].id;
			this.loadedWallets.push(wallet);
		}

		var complete = _.invoke(this.loadedWallets, 'fetch');

		$.when.apply($, complete).done(function() {
			var completeTransactions = _.invoke(plan.loadedWallets, 'getTransactionsForPeriod', plan.get('start_datetime'), plan.get('goal_datetime'));
			$.when.apply($, completeTransactions).done(function() {
				var allTransactions = Array.prototype.slice.call(arguments);
				for (var k in allTransactions) {
					var wallet_id = plan.loadedWallets[k].id;
					plan.transactions[wallet_id] = allTransactions[k];
				}

				plan.trigger('walletsloadded');
			});
		});
	}

});