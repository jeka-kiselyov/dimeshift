// news_item.js
App.Models.NewsItem = Backbone.Model.extend({	

	defaults: {
        title: null,
        body: null,
        slug: null
    },
    url: function() {
        if (this.id)
            return App.settings.apiEntryPoint + 'news_items/' + (typeof(this.id) === 'undefined' ? '' : this.id);
        else
            return App.settings.apiEntryPoint + 'news_items/by_slug/' + this.get('slug');
    }
});
