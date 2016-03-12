// wallet_plans.js
App.Views.Parts.WalletPlans = Backbone.View.extend({

	templateName: 'parts/wallet_plans',
	events: {},
	areStatsReady: false,
	initialize: function() {
		console.log('views/parts/wallet_plans.js | Initializing Wallet Plans view');
		if (!this.model || !this.id)
			console.error('views/parts/wallet_plans.js | model and dom id should be provided for this view');

		this.areStatsReady = false;
		var that = this;

		App.exchange.loadRates(function() {
			that.listenToOnce(that.model, 'plansloaded', function() {
				that.invokeStatsLoading();
			});
			that.listenTo(that.model, 'plansloaded', that.render);
			that.model.getPlans();
		});
	},
	wakeUp: function() {
		console.error('views/parts/wallet_plans.js | Waking up');
	},
	invokeStatsLoading: function() {
		var that = this;
		var complete = _.invoke(this.model.plans.models, 'getStats');
		$.when.apply($, complete).done(function() {
			that.areStatsReady = true;
			that.render();
		});
	},
	render: function() {
		console.log('views/parts/wallet_plans.js | Rendering');
		this.setElement($('#' + this.id));

		var plans = [];
		if (this.model.plans)
			for (var i = 0; i < this.model.plans.length; i++) {
				var allowedToSpend = null;
				var allowedToSpendInWalletCurrency = null;

				if (this.areStatsReady) {
					allowedToSpend = this.model.plans.at(i).getPlanForToday();
					allowedToSpendInWalletCurrency = App.exchange.convert(allowedToSpend, this.model.plans.at(i).get('goal_currency'), this.model.get('currency'));
					console.log(allowedToSpendInWalletCurrency);
				}

				plans.push({
					plan: this.model.plans.at(i).toJSON(),
					allowedToSpend: allowedToSpend,
					allowedToSpendInWalletCurrency: allowedToSpendInWalletCurrency
				});
			}

		var data = {
			wallet: this.model.toJSON(),
			plans: plans,
			areStatsReady: this.areStatsReady
		};
		var that = this;
		App.templateManager.fetch(this.templateName, data, function(html) {
			that.$el.html(html);
			that.$('[data-toggle="tooltip"]').tooltip();
			that.trigger('render');
			that.trigger('loaded');
		});
	}
});