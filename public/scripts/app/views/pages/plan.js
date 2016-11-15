// plan.js
App.Views.Pages.Plan = App.Views.Abstract.Page.extend({

	templateName: 'pages/plans/view',
	category: 'plan',
	events: {
		"click #reload_stats_button": 'reloadStats'
	},
	title: function() {
		return 'Plan report';
	},
	url: function() {
		if (typeof(this.model) != 'undefined' && this.model.id)
			return 'plans/' + this.model.id;
	},
	render: function() {
		console.log('views/pages/plan.js | rendering');

		this.once('render', function() {
		});

		this.renderHTML({
			plan: this.model.toJSON(),
			stats: this.model.stats,
			currentTimestamp: (new Date().getTime() / 1000),
			adviceData: this.getAdviceData()
		});
	},
	reloadStats: function() {
		var that = this;
		this.$('#reload_stats_button').button('loading');
		this.listenToOnce(this.model, 'statsready', function() {
			that.$('#reload_stats_button').button('reset');

		});
		this.model.reloadStats();

		return false;
	},
	getAdviceData: function() {
		var hasToday = false;
		var hasTomorrow = false;
		var hasFuture = false;
		var currentTimestamp = (new Date().getTime() / 1000);
		var todayI = null;
		var todaysPlan = 0;
		var todaysAlreadyTotal = 0;
		var todaysDif = 0;
		var tomorrowPlan = 0;
		var futureMaxPlan = 0;
		var futureEndDate = null;

		for (var i = 0; i < this.model.stats.length; i++) {
			if (this.model.stats[i].date.unix_from < currentTimestamp && this.model.stats[i].date.unix_to > currentTimestamp) {
				hasToday = true;
				todayI = i;
				if (i < this.model.stats.length - 1) {
					hasTomorrow = true;
				}
				if (i < this.model.stats.length - 2) {
					hasFuture = true;
				}
			}
		}

		todaysPlan = this.model.stats[todayI].allowedToSpend;
		todaysAlreadyTotal = this.model.stats[todayI].profitsTotal - this.model.stats[todayI].expensesTotal;
		if (hasTomorrow) {
			tomorrowPlan = this.model.stats[todayI+1].allowedToSpend;
			if (hasFuture) {
				futureMaxPlan = this.model.stats[this.model.stats.length - 1].allowedToSpend; 
				futureEndDate = this.model.stats[this.model.stats.length - 1].date.unix;
			}
		} else {
			todaysDif = todaysPlan - todaysAlreadyTotal;
		}

		return {
			hasToday: hasToday,
			hasTomorrow: hasTomorrow,
			hasFuture: hasFuture,
			todaysPlan: todaysPlan,
			todaysAlreadyTotal: todaysAlreadyTotal,
			todaysDif: todaysDif,
			tomorrowPlan: tomorrowPlan,
			futureMaxPlan: futureMaxPlan,
			futureEndDate: futureEndDate
		};
	},
	wakeUp: function() {
		console.log('views/pages/plan.js | waking up');
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function() {
			var plan_id = that.model.id;
			that.model = new App.Models.Plan();
			that.model.id = plan_id;

			that.model.fetch({
				error: function() {
					App.showPage('NotFound');
				}
			}).done(function() {
				App.exchange.loadRates(function() {
					that.listenTo(that.model, 'statsready', that.render);
					that.model.getStats();
				});
			});
		});
	},
	initialize: function(params) {
		console.log('views/pages/plan.js | initializing');
		this.renderLoading();

		var that = this;
		this.requireSingedIn(function() {
			/// initialize models, collections etc. Request fetching from storage
			if (typeof(params.item) !== 'undefined') {
				that.model = params.item;
				that.render();
			} else if (typeof(params.id) !== 'undefined') {
				that.model = new App.Models.Plan();
				that.model.id = params.id;

				that.model.fetch({
					error: function() {
						App.showPage('NotFound');
					}
				}).done(function() {
					App.exchange.loadRates(function() {
						that.listenTo(that.model, 'statsready', that.render);
						that.model.getStats();
					});
				});
			} else
				throw 'id or item parameters required';

		});
	}

});