// signin.js
App.Views.Dialogs.Signin = App.Views.Abstract.Dialog.extend({

	dialogName: 'signin',
	events: {
		"submit form": "onSubmit"
	},
	initialize: function() {
		var that = this;
		this.on('ready', function() {
			that.$('#input_username').focus();
		});
		this.show();
	},
	onSubmit: function() {
		this.$('.btn-primary').button('loading');

		var username = this.$('#input_username').val();
		var password = this.$('#input_password').val();

		App.currentUser.set('login', username);
		App.currentUser.set('password', password);
		this.listenTo(App.currentUser, 'signedin', function(){
			this.$('.btn-primary').button('reset');
			this.hide();
		});
		this.listenTo(App.currentUser, 'invalid', function(){
			this.$('.btn-primary').button('reset');
			this.$('.errors-container').slideDown();
			this.$('#input_username').focus();
			var that = this;
			setTimeout(function() {
				that.$('.errors-container').slideUp();
			}, 2000);
		});

		// App.currentUser.on('signedin', function(){
		// });
		// App.currentUser.on('invalid', function(){
		// 	that.$('.btn-primary').button('reset');
		// 	that.$('.errors-container').slideDown();
		// 	that.$('#input_username').focus();

		// 	setTimeout(function() {
		// 		that.$('.errors-container').slideUp();
		// 	}, 2000);
		// });
		App.currentUser.signIn(username, password);

		return false;
	},
	onResponse: function(user) {
		var that = this;
		if (user.isSignedIn())
		{
			this.$('#signin_modal_form_submit').button('reset');
			this.hide();
		} else {
			this.$('#signin_invalid_password_alert').slideDown();
			this.$('#signin_modal_form_submit').button('reset');
			this.$('#input_username').focus();

			setTimeout(function() {
				that.$('#signin_invalid_password_alert').slideUp();
			}, 1000);
		}
	}
});