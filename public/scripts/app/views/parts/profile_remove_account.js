// profile_remove_account.js
App.Views.Parts.ProfileRemoveAccount = Backbone.View.extend({

	events: {
		"submit #remove_account_step_1_form": "proccess1",
		"submit #remove_account_step_2_form": "proccess2"
	},

	proccess1: function() {
		this.$('#remove_account_step_1_submit').button('loading');

		this.listenTo(App.currentUser, 'removeaccountstart', function() {
			this.$('#profile_remove_account_step_1').hide();
			this.$('#profile_remove_account_step_2').show();
		});

		App.currentUser.removeAccount();
		return false;
	},
	showWrongCodeMessage: function() {
		var that = this;
		that.$('#invalid_remove_account_code').slideDown('fast');
		setTimeout(function() {
			that.$('#invalid_remove_account_code').slideUp();
		}, 2000);
	},
	proccess2: function() {
		var code = this.$('#remove_account_code').val();
		if (!code) {
			this.showWrongCodeMessage();
			return;
		}
		this.$('#remove_account_step_2_submit').button('loading');

		this.listenTo(App.currentUser, 'removeaccountdone', function() {
			this.$('#profile_remove_account_done').show();
			setTimeout(function() {
				App.currentUser.signOut();
			}, 1000);
		});

		this.listenTo(App.currentUser, 'removeaccountwrongcode', function() {
			this.showWrongCodeMessage();
			this.$('#remove_account_step_2_submit').button('reset');
		});

		App.currentUser.removeAccountConfirm(code);
		return false;
	},
	initialize: function() {
		console.log('views/parts/profile_remove_account.js | Initializing  view');
	},
	wakeUp: function() {
		console.error('views/parts/profile_remove_account.js | Waking up');
	},
	render: function() {
		console.log('views/parts/profile_remove_account.js | Rendering');
		this.setElement($('#' + this.id));
	}
});