// hide_wallet.js
App.Views.Dialogs.HideWallet = App.Views.Abstract.Dialog.extend({

	dialogName: 'hide_wallet',
	events: {
		"submit form": "onSubmit",
		"click .process_button": "doProcess"
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';

		this.show({item: this.item.toJSON()});
	},
	doProcess: function() {
		this.$('.btn-danger').button('loading');	
		this.item.hide();		
		this.hide();
	},
	onSubmit: function() {
		this.hide();
		return false;
	}
});