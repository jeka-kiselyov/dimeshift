// static_page.js
App.Models.StaticPage = Backbone.Model.extend({

	defaults: {
        title: null,
        body: null,
        slug: null
    },
    url: function() {
        if (this.id)
            return App.settings.apiEntryPoint + 'static_pages/' + (typeof(this.id) === 'undefined' ? '' : this.id);
        else
            return App.settings.apiEntryPoint + 'static_pages/by_slug/' + this.get('slug');
    }

});
