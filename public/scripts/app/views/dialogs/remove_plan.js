// remove_plan.js
App.Views.Dialogs.RemovePlan = App.Views.Abstract.Dialog.extend({

	dialogName: 'remove_plan',
	events: {
		"submit form": "onSubmit",
		"click .process_button": "doProcess"
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';

		this.show({
			item: this.item.toJSON()
		});
	},
	doProcess: function() {
		this.$('.btn-danger').button('loading');

		App.localStorage.remove('plan_' + this.item.id + '_data');
		this.item.destroy();
		App.page.render();

		this.hide();

		return false;

	},
	onSubmit: function() {
		this.hide();
		return false;
	}
});