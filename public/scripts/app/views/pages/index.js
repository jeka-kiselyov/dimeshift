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
		App.createCookie('show_tour_Wallets', 1);
		App.createCookie('show_tour_Wallet', 1);
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

			var that = this;
			this.on('render', function() {
				that.resize();
				$(window).on('resize', that.resize);
			});
			this.render();
		}
	},
	sleep: function() {
		$(window).off('resize');
	},
	resize: function() {
		if (typeof(App.page.__resizeThrottled) === 'undefined') {
			App.page.__resizeThrottled = _.throttle(function() {
				var footerOffset = $(window).height() - $('#footer').height() - 20;
				var rulerOffset = $('#screenshots_header_ruler').offset().top;
				if ($(window).width() > 768 && footerOffset > rulerOffset + 180) {
					var margin = footerOffset - (rulerOffset + 180);
					margin = Math.round(margin);
					$('#screenshots_header').css('margin-top', margin + 'px');
				} else {
					$('#screenshots_header').css('margin-top', '0px');
				}
			}, 100);
		}

		App.page.__resizeThrottled();
	},
	initialize: function() {
		var that = this;
		if (typeof(App.currentUser) !== 'undefined' && App.currentUser && App.currentUser.isSignedIn())
			return App.router.redirect('/wallets/');
		this.renderLoading();
		/// initialize models, collections etc. Request fetching from storage

		this.listenTo(App.currentUser, 'signedInStatusChanged', function() {
			App.router.redirect('/wallets/');
		});

		this.on('render', function() {
			$('#demo_signup').clickonmouseover();
			$('.image-link').magnificPopup({
				type: 'image',
				gallery: {
					enabled: true
				},
				callbacks: {
					open: function() {
						App.log.event('homepage', 'Zoom Screenshot');
					}
				},
				image: {
					titleSrc: function(item) {
						return $('#' + item.el.attr('id') + '-title').text() + '<small>' + $('#' + item.el.attr('id') + '-description').text() + '</small>';
					}
				}
			});

			that.resize();
			$(window).on('resize', that.resize);

			if ('ontouchstart' in window || 'onmsgesturechange' in window) {
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