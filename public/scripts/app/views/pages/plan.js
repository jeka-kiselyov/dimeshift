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

		this.once('render', function() {});

		this.renderHTML({
			plan: this.model.toJSON(),
			stats: this.model.stats,
			currentTimestamp: (new Date().getTime() / 1000)
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