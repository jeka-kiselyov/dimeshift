// app.js
window.App = {

	Models: {},
	Collections: {},
	Views: {Abstract: {}, Dialogs: {}, Pages: {}, Widgets: {}, Parts: {}, Charts: {}},
	Tours: {},
	currentTour: null,

	router: null,

	dialog: null,
	page: null,

	header: null,
	footer: null,
	settings: null,

	currentUser: null,

	init: function()
	{
		var that = this;
		$.ajaxSetup({ cache: false });

		var doneCallback = function() {
			that.localStorage.invalidate(that.settings.version);
			that.i18n.setLanguage(that.settings.detectLanguage());
			that.router.init();
			that.loadingStatus(false);
		};

		if (document.cookie.indexOf("is_logged_in_user") >= 0)
		{
			$.get(this.settings.apiEntryPoint+'users', function(user){
				if (user)
					that.setUser(user);
				else
					that.setUser();
			},'json')
			.fail(function() {
				that.setUser();
			}).always(function() {
				doneCallback();
			});
		} else {
			that.setUser();
			doneCallback();
		}
	},
	showDialog: function(dialogName, params) {
		if (typeof(App.Views.Dialogs[dialogName]) === 'undefined') /// this page is already current
			return false;

		if (App.dialog && App.dialog.isVisible)
		{
			App.dialog.once('hidden', function() {
				console.log('Ready to show another dialog');
				App.dialog = new App.Views.Dialogs[dialogName](params);	
			}, this);
			App.dialog.hide();
		} else {
			App.dialog = new App.Views.Dialogs[dialogName](params);		
			App.log.event('dialog', 'Show Dialog '+dialogName);	
		}

		return true;
	},
	showPage: function(pageName, params) {

		console.log('Showing page: '+pageName);

		if (App.currentTour)
			App.currentTour.finish();

		if (typeof(params) === 'undefined')
			params = {};

		if (typeof(App.Views.Pages[pageName]) === 'undefined')
		{
			console.error("There is no view class defined");
			return false;
		}

		if (typeof(this.page) !== 'undefined' && this.page) /// undelegate events from previous page
		{
			this.page.sleep();
		}

		/// Trying to get view from stack
		var fromStack = this.viewStack.getView(pageName, params);


		if (fromStack !== false)
		{
			/// Console log wake up page from stack
			console.log('Showing page from stack');
			this.page = fromStack;
			this.page.wakeUp();
			this.loadingStatus(false);

		} else {
			/// or create new one
			this.loadingStatus(true);
			this.page = new App.Views.Pages[pageName](params);
			this.page.on('loaded', function(){ this.loadingStatus(false); }, this);
			if (this.page.isReady)
				this.loadingStatus(false);
			// this.listenTo(this.page, 'loaded', function(){ this.loadingStatus(false); });
			// this.listenTo(this.page, 'loading', function(){ this.loadingStatus(true); });

			this.viewStack.addView(pageName, params, this.page);
		}
		this.renderLayoutBlocks();

		return true;
	},
	setProgress: function(value)
	{
		if (!this.progress)
			this.progress = new Mprogress();

		if (typeof(value) === 'undefined')
		{
			if (this.progress.status == null)
				return this.progress.start();
			else
				return this.progress.inc();
		}
		if (value >= 1 || value === true)
			return this.progress.end();
		this.progress.set(value);
	},
	loadingStatus: function(status)
	{
		if (status)
		{
			console.log('app.js | Loading status = true');
			this.isLoading = true;
			$('#preloader').stop().show();
		} else {
			console.log('app.js | Loading status = false');
			this.isLoading = false;
			$('#preloader').stop().fadeOut('slow');
		}
	},
	setUser: function(data)
	{
		this.currentUser = new App.Models.User();
		this.currentUser.on('signedInStatusChanged',this.userChanged, this);
		if (typeof(data) !== 'undefined')
			this.currentUser.signInWithData(data);
	},
	userChanged: function()
	{
		console.log('User info changed');
		// You can also refresh the page here if you want to.

		this.renderLayoutBlocks();
	},
	renderLayoutBlocks: function()
	{
		var that = this;

		if (!this.header)
		{
			this.header = new App.Views.Header();
		}

		var renderFunc = function() {
			that.header.render();
		};

		if ($.isReady)
		{
			renderFunc();
		} else {
			$(function(){ renderFunc(); });
		}
	},
	createCookie: function(name, value, days) {
	    var expires;

	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    } else {
	        expires = "";
	    }
	    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	},
	readCookie: function(name) {
	    var nameEQ = encodeURIComponent(name) + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	    }
	    return null;
	},
	eraseCookie: function(name) {
	    App.createCookie(name, "", -1);
	}

};