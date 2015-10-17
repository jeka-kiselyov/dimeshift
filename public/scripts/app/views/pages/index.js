// index.js
App.Views.Pages.Index = App.Views.Abstract.Page.extend({

	templateName: 'pages/index/index',
    category: 'home',
	events: {
		"click #demo_signup": "demoSignUp",
		"click #demo_without_mouse_signup": "demoSignUp"
	},
	demoSignUp: function() {
		App.log.event('registration', 'Demo Sign Up', 'From Homepage');
		this.renderLoading();
		App.currentUser.demoRegister();
	},
	title: function() {
		return 'Homepage';
	},
	render: function() {
		this.renderHTML({});
	},
	wakeUp: function() {
		if (typeof(App.currentUser) !== 'undefined' && App.currentUser && App.currentUser.isSignedIn())
			App.router.redirect('/wallets/');
		else {
			this.holderReady = false;
			this.render();
		}
	},
	initialize: function() {
		if (typeof(App.currentUser) !== 'undefined' && App.currentUser && App.currentUser.isSignedIn())
			return App.router.redirect('/wallets/');
		this.renderLoading();
		/// initialize models, collections etc. Request fetching from storage

		this.listenTo(App.currentUser, 'signedInStatusChanged', function(){
			App.router.redirect('/wallets/');
		});
		
		this.on('render', function(){
			$('#demo_signup').clickonmouseover();
			$('.image-link').magnificPopup({
				type: 'image',
				gallery: { enabled: true },
				callbacks: {
					open: function() {
						App.log.event('homepage', 'Zoom Screenshot');
					}
				},
				image: {
					titleSrc: function(item) {
						return $('#'+item.el.attr('id')+'-title').text() + '<small>'+$('#'+item.el.attr('id')+'-description').text()+'</small>';
					}
				}
			});		

			if ($(window).width() > 800 && $('#footer').offset().top > $('#screenshots_header').offset().top + 180)
			{
				var margin = $('#footer').offset().top - ($('#screenshots_header').offset().top + 180);
				margin = Math.round(margin);
				$('#screenshots_header').css('margin-top', margin+'px');
			}

			if ('ontouchstart' in window || 'onmsgesturechange' in window)
			{
				//// touch device
				$('.register_without_mouse').fadeIn('slow');
			} else {
				//// pc
				$('.register_with_mouse').fadeIn('slow');
			}

		});

		this.render();
	}

});