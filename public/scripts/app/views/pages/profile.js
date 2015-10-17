// profile.js
App.Views.Pages.Profile = App.Views.Abstract.Page.extend({

	templateName: 'pages/profile/index',
    category: 'user',
	title: function() {
		return 'User Profile';
	},
	url: function() {
		return 'profile';
	},
	initializeParts: function() {
		console.info('views/pages/profile.js | initializing parts');
		this.parts = [];
		this.parts.push(new App.Views.Parts.ProfileChangePassword({id: 'profile_change_password_container'}));
		this.partsInitialized = true;
	},
	render: function() {
		console.log('views/pages/profile.js | Renedring user profile');
		if (!this.partsInitialized)
			this.initializeParts();

		this.once('render',function(){
			for (var k in this.parts)
				this.parts[k].render();
		});

		this.renderHTML({});
	},
	wakeUp: function() {
		console.log('views/pages/profile.js | waking up');
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function(){

			that.render();
		});
	},
	initialize: function(params) {
		console.log('views/pages/profile.js | initializing');
		this.renderLoading();
		var that = this;
		this.requireSingedIn(function(){
			that.render();
		});
	}

});