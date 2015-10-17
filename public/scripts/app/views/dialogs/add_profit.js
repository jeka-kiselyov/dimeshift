// add_profit.js
App.Views.Dialogs.AddProfit = App.Views.Abstract.Dialog.extend({

	dialogName: 'add_profit',
	events: {
		"submit form": "onSubmit"
	},
	initialize: function(params) {
		this.wallet = params.wallet || false;

		var that = this;
		this.on('ready', function() {
			that.$('#input_amount').focus();
		});
		
		this.show();
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');

		var amount = this.$('#input_amount').val();
		var description = this.$('#input_description').val();
		
		amount = +amount;
		if (amount && amount > 0)
		{
			this.wallet.addProfit(amount, description);			
		}

		this.hide();

		return false;
	}
});