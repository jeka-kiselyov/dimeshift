// profile.js
App.Views.Pages.Profile = App.Views.Abstract.Page.extend({

	templateName: 'pages/profile/index',
	category: 'user',
	events: {
		'click .select_part': 'selectPart'
	},
	title: function() {
		return 'User Profile';
	},
	url: function() {
		return 'profile';
	},
	selectPart: function(ev) {
		var target = $(ev.currentTarget).data('target');
		this.$('#profile_' + target + '_container').show();
		this.$('.profile_container').not("[id='profile_" + target + "_container']").hide();
		$(ev.currentTarget).parents('ul').children('li').removeClass('active');
		$(ev.currentTarget).parents('li').addClass('active');
	},
	initializeParts: function() {
		console.info('views/pages/profile.js | initializing parts');
		this.parts = [];
		this.parts.push(new App.Views.Parts.ProfileChangePassword({
			id: 'profile_change_password_container'
		}));
		this.parts.push(new App.Views.Parts.ProfileRemoveAccount({
			id: 'profile_remove_account_container'
		}));
		this.partsInitialized = true;
	},
	render: function() {
		console.log('views/pages/profile.js | Renedring user profile');
		if (!this.partsInitialized)
			this.initializeParts();

		this.once('render', function() {
			for (var k in this.parts)
				this.parts[k].render();
		});

		this.renderHTML({
			user: App.currentUser
		});
	},
	wakeUp: function() {
		console.log('views/pages/profile.js | waking up');
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function() {

			that.render();
		});
	},
	initialize: function(params) {
		console.log('views/pages/profile.js | initializing');
		this.renderLoading();
		var that = this;
		this.requireSingedIn(function() {
			that.render();
		});
	}

});