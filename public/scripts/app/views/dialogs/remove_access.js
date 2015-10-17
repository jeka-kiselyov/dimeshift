// remove_access.js
App.Views.Dialogs.RemoveAccess = App.Views.Abstract.Dialog.extend({

	dialogName: 'remove_access',
	events: {
		"submit form": "onSubmit",
		"click .process_button": "doProcess"
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';
		

		if (typeof(params.access) != 'undefined')
			this.access = params.access;
		else
			throw 'Can not initialize dialog without param.access';

		this.show({item: this.item.toJSON(), access: this.access.toJSON()});
	},
	doProcess: function() {
		var that = this;
		this.$('.btn-danger').button('loading');	
		this.listenToOnce(this.access, 'sync error', function(){
			App.showDialog('WalletAccesses', {item: that.item});
		});
		this.access.destroy();
	},
	onSubmit: function() {
		App.showDialog('WalletAccesses', {item: this.item});
		return false;
	}
});