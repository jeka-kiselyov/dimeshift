// news_items.js
App.Views.Pages.NewsItems = App.Views.Abstract.Page.extend({

	page: 1,
	newsCategoryId: false,
	perPage: 25,
	templateName: 'pages/news/recent',
    category: 'news',
	widgets: [],
	title: function() { return 'News, page: '+this.page; },
	url: function() {
		if (this.newsCategoryId == false)
		{
			if (this.page == 1)
				return 'news/recent';
			else
				return 'news/recent/'+this.page;
		}
		else
		{

			if (this.page == 1)
				return 'news/category/'+this.newsCategoryId;
			else
				return 'news/category/'+this.newsCategoryId+'/'+this.page;			
		}
	},
	events: {
		"click #go_to_prev": "prevPage",
		"click #go_to_next": "nextPage",
		"click .to_news_item": "toNewsItem"
	},
	toNewsItem: function(ev) {
		var data = $(ev.currentTarget).data();
		if (typeof(data.newsItemId) === 'undefined')
			return true;

		var newsItemId = parseInt(data.newsItemId, 10);
		var item = this.items.get(newsItemId);

		if (!item)
			return true;

		//App.router.setUrl('news/view/'+item.get('slug')+'.html');
		App.showPage('NewsItem', {item: item});

		return false;
	},
	prevPage: function() {
		if (this.page == 1)
			return false;

		console.log("Navigating to prev page");
		App.showPage('NewsItems', {page: this.page - 1, newsCategoryId: this.newsCategoryId});
		return false;
	},
	nextPage: function() {
		if (!this.items.hasNextPage())
			return false;
		
		console.log("Navigating to next page");
		App.showPage('NewsItems', {page: this.page + 1, newsCategoryId: this.newsCategoryId});
		return false;
	},
	render: function() {
		console.log("Rendering news items");
		this.renderHTML({items: this.items.toJSON(), currentPage: this.page, perPage: this.perPage, news_category_id: this.newsCategoryId});
		
		if (!this.items.hasNextPage())
			this.$('#go_to_next').parent().addClass('disabled');
		else
			this.$('#go_to_next').parent().removeClass('disabled');
		
		if (!this.items.hasPreviousPage())
			this.$('#go_to_prev').parent().addClass('disabled');
		else
			this.$('#go_to_prev').parent().removeClass('disabled');
	},
	initialize: function(params) {
		console.log('news_items.js | initialize');

		if (typeof(params.page) !== 'undefined')
			this.page = parseInt(params.page, 10);

		if (typeof(params.newsCategoryId) !== 'undefined' && params.newsCategoryId)
			this.newsCategoryId = parseInt(params.newsCategoryId, 10);
		else
			this.newsCategoryId = false;

		/// initialize models, collections etc. Request fetching from storage
		this.items = new App.Collections.NewsItems([], {newsCategoryId: this.newsCategoryId});
		this.items.state.pageSize = this.perPage; //setPageSize(this.perPage);

		this.renderLoading();		
		// this.listenTo(this.items, 'add', this.render);
		// this.listenTo(this.items, 'reset', this.render);
		// this.listenTo(this.items, 'remove', this.render);
		try {
			var that = this;
			this.items.getPage(this.page).done(function(){
				that.render();

				that.listenTo(that.items, 'add', that.render);
				that.listenTo(that.items, 'reset', that.render);
				that.listenTo(that.items, 'remove', that.render);
			});
		} catch(err) {
			console.error('RRR');
			//this.render();
		}
	}

});