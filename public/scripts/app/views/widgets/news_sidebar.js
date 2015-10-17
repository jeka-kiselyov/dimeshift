// news_sidebar.js
// Note that the name should be the same as XXX in 'shared/widget/XXX.tpl'
App.Views.Widgets.news_sidebar = Backbone.View.extend({

	templateName: 'news_sidebar',
	cacheTime: 10,
	initialize: function() {
		console.log('Initializing news_sidebar widget');

		this.render();
	},
	renderLoading: function() {

	},
	renderHTML: function(data) {
		if (typeof(data) === 'undefined')
			var data = {};
		var that = this;
		App.templateManager.fetch('widgets/'+this.templateName, data, function(html) {
			that.$el.html(html);
			that.trigger('render');
			that.trigger('loaded');

			if (typeof(App.page) !== 'undefined' && App.page && typeof(App.page.newsCategoryId) !== 'undefined' && App.page.newsCategoryId)
				that.$('#news_sidebar_item_'+App.page.newsCategoryId).addClass('active');
		});		
	},
	tryToGetCachedData: function() {
		var inCache = App.localStorage.get('widget-data-'+this.templateName);
		if (inCache && typeof(inCache.added) !== 'undefined' && typeof(inCache.data) !== 'undefined' && inCache.added > (new Date().getTime() / 1000) - this.cacheTime)
			return inCache.data;
		return false;
	},
	setDataToCache: function(data) {
		App.localStorage.set('widget-data-'+this.templateName, {added: (new Date().getTime() / 1000), data: data});
	},
	render: function() {
		this.renderLoading();
		var data = this.tryToGetCachedData();
		if (data)
		{
			/// has data in cache
			this.renderHTML(data);
		} else {
			this.categories = new App.Collections.NewsCategories();
			var that = this;
			$.when( this.categories.fetch() ).done(function( a1 ) {
				var data = {categories: that.categories.toJSON()};
				that.setDataToCache(data);
				that.renderHTML(data);
			});

		}
	}
});
