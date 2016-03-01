// set_total_to.js
App.Views.Dialogs.SetTotalTo = App.Views.Abstract.Dialog.extend({

	dialogName: 'set_total_to',
	events: {
		"submit form": "onSubmit"
	},
	focusOnInit: '#input_total',
	initialize: function(params) {
		this.wallet = params.wallet || false;
		this.show();
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');

		var total = this.$('#input_total').val();
		//var description = this.$('#input_description').val();

		if (Number(total) === parseFloat(total, 10)) {
			total = +total;
			this.wallet.setTotalTo(total);
		}

		this.hide();

		return false;
	}
});