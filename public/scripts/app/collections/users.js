//users.js
App.Collections.Users = Backbone.Collection.extend({
	model: App.Models.User,
    url: function() {
		return App.settings.apiEntryPoint + 'users';
    },
});



