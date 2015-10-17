// transaction_details.js
App.Views.Dialogs.TransactionDetails = App.Views.Abstract.Dialog.extend({

	dialogName: 'transaction_details',
	events: {
		"submit form": "onSubmit",
		"click #remove_transaction_button": "removeTransaction"
	},
	removeTransaction: function() {
		App.showDialog('RemoveTransaction', {item: this.item});
		return false;
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';
		if (typeof(params.wallet) != 'undefined')
			this.wallet = params.wallet;
		else
			throw 'Can not initialize dialog without param.wallet';

		this.show({item: this.item.toJSON(), wallet: this.wallet.toJSON()});
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');

		this.hide();

		return false;
	}
});