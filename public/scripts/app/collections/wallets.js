//wallets.js
App.Collections.Wallets = Backbone.Collection.extend({
	model: App.Models.Wallet,
	user_id: false,
    url: function() {
		if (this.user_id)
			return App.settings.apiEntryPoint + 'users/' + this.user_id + '/wallets';
		else
			return App.settings.apiEntryPoint + 'wallets';
    },
    search: function(opts) {
        var result = this.where(opts);
        var resultCollection = new App.Collections.Wallets(result);

        return resultCollection;
    },
    setUserId: function(user_id) {
		this.user_id = user_id;
    },
});



