// profile_change_password.js
App.Views.Parts.ProfileChangePassword = Backbone.View.extend({

	events: {
		"submit #change_password_form": "proccess",
	},

	proccess: function() {
		var currentPassword = this.$('#current_password_input').val();
		var newPassword = this.$('#new_password_input').val();
		var repeatPassword = this.$('#new_password_repeat_input').val();

		if (repeatPassword != newPassword)
		{
			this.showError(2);
			return false;
		}

		if (newPassword.length < 6)
		{
			this.showError(3);
			return false;
		}

		this.$('.btn-primary').button('loading');

		this.listenTo(App.currentUser, 'invalid', function(){
			this.showError(1);
		});

		this.listenTo(App.currentUser, 'changed', function(){
			this.$('.alert-danger').hide();
			this.$('form').hide();
			this.$('.alert-info').show();
		});
		
		App.currentUser.changePassword(currentPassword, newPassword);

		return false;
	},
	showError: function(errorNo) {

		this.$('.btn-primary').button('reset');
		this.$('span', '.alert-danger').hide();
		this.$('.errorNo'+errorNo, '.alert-danger').show();

		if (this.$('.errorNo'+errorNo, '.alert-danger') 
			&& typeof(this.$('.errorNo'+errorNo, '.alert-danger').data('input')) !== 'undefined')
		{
			/// highlight input described as  data-input="new_password_repeat_input" in span
			var formGroup = this.$('#'+this.$('.errorNo'+errorNo, '.alert-danger').data('input')).closest('.form-group');
			if (formGroup)
			{
				formGroup.addClass('has-error');
				setTimeout(function(){
					formGroup.removeClass('has-error');
				}, 3000);
				this.$('#'+this.$('.errorNo'+errorNo, '.alert-danger').data('input')).focus();
			}
		}

		this.$('.alert-danger').stop(true, true).slideDown('fast');
		var that = this;
		setTimeout(function(){
			that.$('.alert-danger').slideUp('slow');
		}, 3000);
	},

	initialize: function() {
		console.log('views/parts/profile_change_password.js | Initializing  view');
	},
	wakeUp: function() {
		console.error('views/parts/profile_change_password.js | Waking up');
	},
	render: function() {
		console.log('views/parts/profile_change_password.js | Rendering');
		this.setElement($('#'+this.id));
	}
});
