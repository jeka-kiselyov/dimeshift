//plans.js
App.Collections.Plans = Backbone.Collection.extend({
	model: App.Models.Plan,
	user_id: false,
	wallet_id: false,
	url: function() {
		if (this.wallet_id)
			return App.settings.apiEntryPoint + 'wallets/' + this.wallet_id + '/plans';
		else
			return App.settings.apiEntryPoint + 'plans';
	},
	setUserId: function(user_id) {
		this.user_id = user_id;
	},
	setWalletId: function(wallet_id) {
		this.wallet_id = wallet_id;
	},
});