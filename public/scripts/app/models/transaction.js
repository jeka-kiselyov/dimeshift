// transaction.js
App.Models.Transaction = Backbone.Model.extend({

	defaults: function() {
        return {
            user_id: null,
            wallet_id: null,
            description: null,
            type: null,
            subtype: null,
            amount: null,
            abs_amount: null,
            datetime: Math.floor((new Date().getTime()) / 1000)
        }
    },
    url: function() {
        if (!this.get('wallet_id'))
            return App.settings.apiEntryPoint + 'transactions/' + (typeof(this.id) === 'undefined' ? '' : this.id);
        else
            return App.settings.apiEntryPoint + 'wallets/'+this.get('wallet_id')+'/transactions/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    }

});
