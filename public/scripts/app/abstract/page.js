// page.js
App.Views.Abstract.Page = Backbone.View.extend({

	isReady: false,
	requiresSignedIn: false,
	widgets: [],
	parts: [],
	partsInitialized: false,
	requireSingedIn: function(callback)
	{
		this.requiresSignedIn = true;

		this.listenToOnce(App.currentUser, 'signedout', function() {
				console.log('abstract/page.js | Clearing stack and redirect user back to the root');
				App.viewStack.clear();
				App.router.redirect('/');			
		});

		if (typeof(App.currentUser) !== 'undefined' && App.currentUser.isSignedIn())
		{
			if (typeof(callback) === 'function')
				callback(App.currentUser);
			return App.currentUser;
		}
		else
		{
			this.listenToOnce(App.currentUser, 'signedin', function(){
					callback(App.currentUser);				
			});
			App.showDialog('Signin');
			App.dialog.on('hidden', function(){
				if (!App.currentUser.isSignedIn())
				{
					App.viewStack.clear();
					App.router.navigate('/', {trigger: true});					
				}
			});
		}
	},
	setURL: function(url) {
		if (typeof(url) === 'undefined')
		{
			var url = '';
			if (typeof(this.url) === 'function')
				url = this.url();
			else if (typeof(this.url) === 'string')
				url = this.url;
		}

		if (url)
		{
			App.router.setUrl(url);
			App.log.setURL(url);
		} else {
			App.log.setURL('');
		}

		App.log.pageView();
	},
	setTitle: function(title) {
		if (typeof(title) === 'undefined')
		{
			var title = '';
			if (typeof(this.title) === 'function')
				title = this.title();
			else if (typeof(this.title) === 'string')
				title = this.title;
		}
		
		if (typeof(App.settings.title) == 'function')
			title = App.settings.title(title);

		if (title)
		{
			console.log("Document title changed to '"+title+"'");
			$(document).attr('title', title);
			App.log.setTitle(title);
		}
	},
	wakeUp: function() {
		App.setProgress(false);
		this.holderReady = false;
		this.render();
	},
	sleep: function() {
		
		for (var k in this.parts)
		{
			this.parts[k].undelegateEvents();
			this.parts[k].stopListening();
		}

		this.undelegateEvents();
		this.stopListening();
	},
	proccessWidgets: function() {
		this.widgets = [];
		var that = this;
		this.$('.client-side-widget').each(function(){
			var data = $(this).data();
			if (typeof(data.widgetName) === 'undefined' || !data.widgetName)
				return false;

			if (typeof(App.Views.Widgets[data.widgetName]) === 'undefined')
			{
				console.error('Widget class for '+data.widgetName+' is not defined');
				return false;
			}

			var widgetView = new App.Views.Widgets[data.widgetName]({  
			  el: $(this)
			});

			that.widgets.push(widgetView);
		});
	},
	renderHTML: function(data) {

		if (typeof(this.templateName) === 'undefined' || !this.templateName)
			throw 'templateName is undefined';

		if (typeof(data) === 'undefined')
			data = {};

		this.switchBuffers();

		var that = this;
		App.templateManager.fetch(this.templateName, data, function(html) {
			that.$el.html('<div class="page">'+html+'</div>');
			$('.page', "#page_holder_"+App.currentHolder).removeClass('page_loading');
			that.proccessWidgets();
			that.trigger('render');
			that.trigger('loaded');

			App.setProgress(true);
		});
		this.setTitle();
		this.setURL();
		this.isReady = true;
		// var that = this;
		// setTimeout(function(){
		// 	that.proccessWidgets();
		// }, 1);
		
		return this;
	},
	switchBuffers: function() {
		if (typeof(this.holderReady) !== 'undefined' && this.holderReady === true)
			return true;
		console.log('Switching buffers');
		var holderToRenderTo = 2;
		if (typeof(App.currentHolder) !== 'undefined' && App.currentHolder == 2)
			holderToRenderTo = 1;

		var holderToFadeOut = (holderToRenderTo == 1) ? 2 : 1;

		$("#page_holder_"+holderToFadeOut).hide();
		$("#page_holder_"+holderToFadeOut).html('');
		$("#page_holder_"+holderToRenderTo).show();

		this.setElement($("#page_holder_"+holderToRenderTo));

		App.currentHolder = holderToRenderTo;

		this.holderReady = true;
	},
	renderLoading: function() {
		/// ask templateManager to prepare template
		App.setProgress(false);
		App.templateManager.fetch(this.templateName, {});

		this.switchBuffers();

		this.$el.html('<div class="page page_loading"></div>');
		
		this.setTitle();
		this.setURL();

		console.log('Displaying loading');
		this.trigger('loading');
	}

});