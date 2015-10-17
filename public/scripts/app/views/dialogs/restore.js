// restore.js
App.Views.Dialogs.Restore = App.Views.Abstract.Dialog.extend({

	dialogName: 'restore',
	events: {
		"submit form": "onSubmit"
	},
	initialize: function() {
		var that = this;
		this.on('ready', function() {
			that.$('#input_email').focus();
		});
		this.show();
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');

		var email = this.$('#input_email').val();

		this.listenTo(App.currentUser, 'restore:error', function(){
			var html = ""; for (var k in App.currentUser.validationError) html+=App.currentUser.validationError[k].msg+"<br>";
			this.$('.errors-container').html(html);
			this.$('.errors-container').slideDown();

			this.$('#input_email').focus();	/// @todo: focus to input with error
			this.$('.btn-primary').button('reset');
			var that = this;
			setTimeout(function() {
				that.$('.errors-container').slideUp();
			}, 2000);
		});

		this.listenTo(App.currentUser, 'restore:success', function(){
			this.$('.modal-body-default').slideUp();
			this.$('.modal-body-success').slideDown();
		});

		// App.currentUser.on("signedInStatusChanged", function(){
		// 	App.userChanged();
		// 	that.hide();
		// });
		App.currentUser.restorePassword(email);

		return false;
	}
});