// wallets.js
App.Tours.Wallets = {
	tour: null,
	page: null,
	finish: function() {
		App.eraseCookie('show_tour_Wallets');
		this.tour.end();
	},
	init: function(page) {
		if (!App.readCookie('show_tour_Wallets'))
			return false;
		
		var that = this;

		App.currentTour = this;

		var nextFunction = function() {
			var step = that.tour.getCurrentStep()+1;
			that.tour.restart();
			that.tour.goTo(step);
		}

		this.page = page;
		this.tour = new Tour({
			steps: [
				{
					element: "#wallet_items",
					title: "Step 1 of 3",
					content: $('#tour_step_0').html(),
					reflex: false,
					placement: 'auto'
				},
				{
					element: "#add_wallet_button",
					placement: 'auto',
					reflex: true,
					title: "Step 2 of 3",
					content: $('#tour_step_1').html(),
					onNext: function(tour) {
						that.tour.end();

						setTimeout(function(){
							if (App.dialog && App.dialog.isVisible)
								that.page.listenToOnce(App.dialog, 'hidden', nextFunction);
							else
								nextFunction();
						}, 50);
					} //// onNext
				},
				{
					element: "#wallet_items",
					placement: 'auto',
					reflex: false,
					title: "Step 3 of 3",
					content: $('#tour_step_2').html(),
					onNext: function(tour) {
						that.tour.end();

						setTimeout(function(){
							if (App.dialog && App.dialog.isVisible)
								that.page.listenToOnce(App.dialog, 'hidden', nextFunction);
							else
								nextFunction();
						}, 50);
					} //// onNext
				}
			]
			});

		// Initialize the tour
		that.tour.init();

		// Start the tour
		that.tour.start(true);
		that.tour.goTo(0);
	}
} 