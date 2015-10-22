// update_password.js
App.Views.Pages.UpdatePassword = App.Views.Abstract.Page.extend({
	events: {
		"submit #update_password_form": "proccess",
	},
	templateName: 'pages/user/update_password',
    category: 'user',
	title: function() {
		return 'Update Password';
	},
	proccess: function() {
		var password_restore_code = this.$('#password_restore_code').val();
		var password_restore_hash = this.$('#password_restore_hash').val();
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

		this.listenTo(App.currentUser, 'newpassword:error', function(){
			this.showError(1);
		});

		this.listenTo(App.currentUser, 'newpassword:success', function(){
			this.$('.alert-danger').hide();
			this.$('form').hide();
			this.$('.alert-info').show();
		});
		
		App.currentUser.newPassword(password_restore_code, password_restore_hash, newPassword);

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
	render: function() {

		var that = this;
		this.once('render',function(){
			that.$('#new_password_input').focus();
		});

		this.renderHTML({password_restore_code: this.password_restore_code, password_restore_hash: this.password_restore_hash});
	},
	initialize: function(params) {

		if (typeof(params.password_restore_code) !== 'undefined')
		{
			this.password_restore_code = ''+params.password_restore_code;
			this.password_restore_hash = ''+params.password_restore_hash;
		} else
			throw 'password_restore_code and password_restore_hash parameters required';

		this.render();
	}

});