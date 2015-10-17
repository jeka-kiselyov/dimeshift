// static.js
App.Views.Pages.Static = App.Views.Abstract.Page.extend({

	templateName: 'pages/static/view',
    category: 'static',
	title: function() {
		if (typeof(this.model) != 'undefined' && this.model.get('title'))
			return this.model.get('title');
	},
	render: function() {
		this.renderHTML({static_page: this.model.attributes});
	},
	wakeUp: function() {
		if (!this.model.id)
			App.showPage('NotFound');
	},
	initialize: function(params) {

		/// initialize models, collections etc. Request fetching from storage
		this.model = new App.Models.StaticPage();
		this.model.set('slug', params.slug);
		
		this.listenTo(this.model, 'change', this.render);

		this.renderLoading();
		
		this.model.fetch({error: function(){
			App.showPage('NotFound');
		}});
	}

});