// news_categories.js
App.Collections.NewsCategories = Backbone.Collection.extend({
	model: App.Models.NewsCategory,
	url: App.settings.apiEntryPoint+"news_categories",
});


