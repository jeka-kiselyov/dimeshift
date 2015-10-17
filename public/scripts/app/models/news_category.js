// news_category.js
App.Models.NewsCategory = Backbone.Model.extend({	

	defaults: {
        name: null
    },
    url: function() {
        return App.settings.apiEntryPoint + 'news_categories/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    }
});
