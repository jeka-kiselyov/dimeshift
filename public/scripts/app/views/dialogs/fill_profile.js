// fill_profile.js
App.Views.Dialogs.FillProfile = App.Views.Abstract.Dialog.extend({

	dialogName: 'fill_profile',
	events: {
		"submit form": "onSubmit"
	},
	initialize: function() {
		var that = this;
		this.on('ready', function() {
			that.$('#input_login').focus().select();
		});
		this.show();
	},
	onSubmit: function() {
		var that = this;

		this.$('.btn-primary').button('loading');

		var login = this.$('#input_login').val();
		var password = this.$('#input_password').val();
		var email = this.$('#input_email').val();

		this.listenTo(App.currentUser, 'invalid', function(){
			var html = ""; for (var k in App.currentUser.validationError) html+=App.currentUser.validationError[k].msg+"<br>";
			this.$('.errors-container').html(html);
			this.$('.errors-container').slideDown();

			this.$('#input_login').focus();	/// @todo: focus to input with error
			this.$('.btn-primary').button('reset');
			var that = this;
			setTimeout(function() {
				that.$('.errors-container').slideUp();
			}, 2000);
		});

		this.listenTo(App.currentUser, 'filled', function(){
			$('#fill_profile_invitation').slideUp();
			this.$('.modal-body-default').slideUp();
			this.$('.modal-body-success').slideDown();

			setTimeout(function(){
				App.dialog.hide();
			},2000);
		});
		
		App.currentUser.fillProfile(login, email, password);

		return false;
	}
});