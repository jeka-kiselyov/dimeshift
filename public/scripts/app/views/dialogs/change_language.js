// change_language.js
App.Views.Dialogs.ChangeLanguage = App.Views.Abstract.Dialog.extend({

	dialogName: 'change_language',
	events: {
		"submit form": "onSubmit",
		"click .process_button": "doProcess"
	},
	currentlyUpdating: false,
	initialize: function() {
		var that = this;
		this.on('ready', function() {

		});
		this.show({
			locales: App.settings.availiableLocales,
			current_locale: App.settings.language
		});
	},
	doProcess: function(ev) {
		if (this.currentlyUpdating)
			return false;
		var code = $(ev.currentTarget).data('code');
		if (code == App.settings.language)
			this.hide();
		else {
			// alert('set '+code);
			this.currentlyUpdating = true;
			var that = this;
			that.$('.process_button_container').fadeTo(0.1, 0.1);
			App.i18n.setLanguage(code, function() {
				that.currentlyUpdating = false;
				that.$('.process_button_container').fadeTo(1, 1);
				App.settings.language = code;
				that.hide();
			});
		}
	},
	onSubmit: function() {
		this.hide();
		return false;
	}
});