// remove_transaction.js
App.Views.Dialogs.RemoveTransaction = App.Views.Abstract.Dialog.extend({

	dialogName: 'remove_transaction',
	events: {
		"submit form": "onSubmit",
		"click .process_button": "doProcess"
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

		this.show({item: this.item.toJSON()});
	},
	doProcess: function() {

		var that = this;

		this.$('.btn-danger').button('loading');	
		App.page.model.removeTransaction(this.item);

		this.hide();

		return false;

		// var that = this;
		// this.$('.btn-danger').button('loading');	
		// this.listenToOnce(this.item, 'sync error', function(){
		// 	that.hide();
		// 	if (typeof(App.page) !== 'undefined' && typeof(App.page.reloadWallet) === 'function')
		// 		App.page.reloadWallet();
		// });
		// this.item.destroy();
	},
	onSubmit: function() {
		App.showDialog('TransactionDetails', {item: this.item, wallet: this.wallet});
		return false;
	}
});