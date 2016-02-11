// plan.js
App.Views.Pages.Plan = App.Views.Abstract.Page.extend({

	templateName: 'pages/plan/index',
	category: 'plan',
	additionalScripts: [
		'/vendors/moment/min/moment.min.js',
		'/vendors/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
	],
	events: {
		"click #button_create_new": "addNew",
		"click #button_step1_next": "step1Next",
		"click #button_step1_back": "step1Back",
		"click #button_step2_back": "step2Back",
		"click .step1_wallet_checkbox": "step1WalletChangeChecked",
		"dp.change .datetimepicker": "dateChanged",
		"change #input_goal_balance": "goalBalanceChanged",
		"keyup #input_goal_balance": "goalBalanceChanged"
	},
	title: function() {
		return 'Plan your expenses';
	},
	url: function() {
		return 'plan';
	},
	preparedData: {},
	addNew: function() {
		this.step = 2;
		this.preparedData = {};
		this.preparedData['goal_datetime'] = (Date.now() / 1000 | 0);
		this.render();
	},
	dateChanged: function(ev) {
		this.preparedData['goal_datetime'] = ev.date.unix();
	},
	goalBalanceChanged: function(ev) {
		var val = parseFloat($(ev.currentTarget).val(), 10);
		this.preparedData['goal_balance'] = val;
	},
	step1WalletChangeChecked: function(ev) {
		var target = $(ev.currentTarget);
		var wallet_id = target.data('id');
		var element = $('.step1_wallet_checkbox[data-id="' + wallet_id + '"]');
		var isChecked = element.hasClass('active');

		if (isChecked) {
			element.removeClass('active');
			$('span', element).addClass('glyphicon-unchecked').removeClass('glyphicon-check');
			if (!this.$('.step1_wallet_checkbox.active').length)
				$('#button_step1_next').prop('disabled', true);
		} else {
			element.addClass('active');
			$('span', element).removeClass('glyphicon-unchecked').addClass('glyphicon-check');
			$('#button_step1_next').prop('disabled', false);
		}
	},
	step1Next: function() {
		var that = this;
		this.preparedData['name'] = this.$('#input_name').val();

		var wallets = [];
		this.$('.step1_wallet_checkbox').each(function() {
			var wallet_id = $(this).data('id');
			var isChecked = $(this).hasClass('active');
			if (isChecked)
				wallets.push(wallet_id);
		});
		this.preparedData['wallets'] = wallets;

		that.preparedData['start_balance'] = 0;
		_.each(this.preparedData['wallets'], function(wallet_id) {
			that.preparedData['start_balance'] += that.wallets.get(wallet_id).getTotal();
		});

		this.step = 2;
		this.render();
	},
	step1Back: function() {
		this.step = 0;
		this.render();
	},
	step2Back: function() {
		this.step = 1;
		this.render();
	},
	step: 0,
	render: function() {
		var that = this;
		this.once('render', function() {
			if (that.step == 2) {
				that.$('.datetimepicker').datetimepicker({
					inline: true,
					minDate: moment(),
					format: 'MM/dd/YYYY'
				});
				// that.$('.datetimepicker')
			}
		});

		this.renderHTML({
			plans: this.plans.toJSON(),
			wallets: this.wallets.toJSON(),
			step: this.step,
			preparedData: this.preparedData
		});
	},
	wakeUp: function() {
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function() {
			that.render();
		});
	},
	initialize: function() {
		console.log('plan.js | initialize');
		this.renderLoading();

		var that = this;
		this.requireSingedIn(function() {
			App.helper.loadAdditionalScripts(that.additionalScripts, function() {

				that.wallets = App.currentUser.getWallets();
				that.plans = App.currentUser.getPlans();

				var complete = _.invoke([that.wallets, that.plans], 'fetch');

				$.when.apply($, complete).done(function() {
					that.render();
				});
			});
		});
	}

});