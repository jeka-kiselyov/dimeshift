// wallet.js
App.Tours.Wallet = {
	tour: null,
	page: null,
	finish: function() {
		App.eraseCookie('show_tour_Wallet');
		this.tour.end();
	},
	init: function(page) {
		if (!App.readCookie('show_tour_Wallet'))
			return false;

		var that = this;

		App.currentTour = this;

		var nextFunction = function() {
			var step = that.tour.getCurrentStep() + 1;
			that.tour.restart();
			that.tour.goTo(step);
		}

		this.page = page;
		this.tour = new Tour({
			onEnd: function(tour) {
				App.eraseCookie('show_tour_Wallet');
			},
			steps: [{
				element: "#add_profit_button",
				title: "Step 1 of 6",
				content: $('#tour_step_0').html(),
				reflex: true,
				placement: 'auto',
				onNext: function(tour) {
						that.tour.end();

						setTimeout(function() {
							if (App.dialog && App.dialog.isVisible)
								that.page.listenToOnce(App.dialog, 'hidden', nextFunction);
							else
								nextFunction();
						}, 50);
					} /// onNext
			}, {
				element: "#set_total_to_button",
				placement: 'auto',
				reflex: true,
				title: "Step 2 of 6",
				content: $('#tour_step_1').html(),
				onNext: function(tour) {
						that.tour.end();

						setTimeout(function() {
							if (App.dialog && App.dialog.isVisible)
								that.page.listenToOnce(App.dialog, 'hidden', nextFunction);
							else
								nextFunction();
						}, 50);
					} //// onNext
			}, {
				element: "#add_transaction_form",
				placement: 'auto',
				reflex: false,
				title: "Step 3 of 6",
				content: $('#tour_step_2').html(),
				onShown: function(tour) {
						var nextStep = tour.getCurrentStep() + 1;
						that.page.listenToOnce(that.page.model, 'addExpense', function() {
							that.tour.goTo(nextStep);
						});
					} //// onShown
			}, {
				element: "#transactions_container",
				placement: 'auto',
				reflex: true,
				title: "Step 4 of 6",
				content: $('#tour_step_3').html(),
				onShown: function() {

				},
				onNext: function(tour) {
						that.tour.end();

						setTimeout(function() {
							if (App.dialog && App.dialog.isVisible)
								that.page.listenToOnce(App.dialog, 'hidden', nextFunction);
							else
								nextFunction();
						}, 50);
					} //// onNext
			}, {
				element: "#balance_canvas",
				placement: 'auto',
				reflex: true,
				title: "Step 5 of 6",
				content: $('#tour_step_4').html(),
				onNext: function() {
					$("#fill_profile_invitation").show();
				}
			}, {
				element: "#fill_profile_invitation",
				placement: 'auto',
				reflex: true,
				title: "Step 6 of 6",
				content: $('#tour_step_5').html(),
				onNext: function() {
					App.currentTour.finish();
				}
			}]
		});

		// Initialize the tour
		that.tour.init();

		// Start the tour
		that.tour.start(true);
		that.tour.goTo(0);
	}
}