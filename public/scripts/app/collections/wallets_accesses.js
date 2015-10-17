//wallets_accesses.js
App.Collections.WalletsAccesses = Backbone.Collection.extend({

	model: App.Models.WalletsAccess,
	wallet_id: false,
    url: function() {
		if (this.wallet_id)
			return App.settings.apiEntryPoint + 'wallets/' + this.wallet_id + '/accesses';
		else
			return App.settings.apiEntryPoint + 'wallets_accesses';
    },
    setWalletId: function(wallet_id) {
		this.wallet_id = wallet_id;
    }
});



