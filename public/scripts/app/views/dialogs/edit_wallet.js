// edit_wallet.js
App.Views.Dialogs.EditWallet = App.Views.Abstract.Dialog.extend({

	dialogName: 'edit_wallet',
	events: {
		"submit form": "onSubmit"
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';

		var that = this;
		this.on('ready', function() {
			that.$('#input_name').focus().select();
		});
		
		this.show({item: this.item.toJSON()});
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');
		var name = this.$('#input_name').val();
		var currency = this.$('#input_currency').val();
		var error = '';
		
		if (!currency)
			error = 'Please select wallet currency';	

		if (error)
		{
			this.$('.errors-container').html(error);
			this.$('.errors-container').slideDown();

			this.$('#input_currency').focus();
			this.$('.btn-primary').button('reset');
			var that = this;
			setTimeout(function() {
				that.$('.errors-container').slideUp();
			}, 2000);
		} else {
			this.item.set('name', name);
			this.item.set('currency', currency);
			this.item.save();

			this.hide();
		}
		

		return false;
	}
});