// news_items.js
App.Collections.NewsItems = Backbone.PageableCollection.extend({
	model: App.Models.NewsItem,
	newsCategoryId: false,
	initialize: function(models, options) {
		if (typeof(options) !== 'undefined' && typeof(options.newsCategoryId) !== 'undefined' && options.newsCategoryId)
			this.newsCategoryId = options.newsCategoryId;
	},
	url: function() {
		if (typeof(this.newsCategoryId) !== 'undefined' && this.newsCategoryId)
			return App.settings.apiEntryPoint+"news_categories/"+this.newsCategoryId+"/news_items";
		else
			return App.settings.apiEntryPoint+"news_items";
	},
	parse: function (resp, options) {
		var newState = this.parseState(resp, _.clone(this.queryParams), _.clone(this.state), options);
		try {
			if (newState) this.state = this._checkState(_extend({}, this.state, newState));
		} catch (error)
		{
			this.trigger('error');
		}
		return this.parseRecords(resp, options);
    },

});



