// news_item.js
App.Views.Pages.NewsItem = App.Views.Abstract.Page.extend({

	templateName: 'pages/news/view',
    category: 'news',
	disqus: null,
	title: function() {
		if (typeof(this.model) != 'undefined' && this.model.get('title'))
			return this.model.get('title');
	},
	url: function() {
		if (typeof(this.model) != 'undefined' && this.model.get('slug'))
			return 'news/view/'+this.model.get('slug')+'.html';
	},
	render: function() {
		console.log('Renedring news item');

		this.on('render', function() {
			this.disqus.render('news_item_'+this.model.get('slug'), this.model.get('title'));
		}, this);

		this.renderHTML({item: this.model.attributes});
	},
	initialize: function(params) {

		/// initialize models, collections etc. Request fetching from storage
		this.disqus = new App.Views.Widgets.Disqus;
		if (typeof(params.item) !== 'undefined')
		{
			this.model = params.item;
			this.render();
			this.listenTo(this.model, 'change', this.render);
		} else if (typeof(params.slug) !== 'undefined') 
		{
			this.model = new App.Models.NewsItem();
			this.model.set('slug', params.slug);
			
			this.listenTo(this.model, 'change', this.render);

			this.renderLoading();
			
			this.model.fetch({error: function(){
				App.showPage('NotFound');
			}});			
		} else
			throw 'slug or item parameters required';
	}

});