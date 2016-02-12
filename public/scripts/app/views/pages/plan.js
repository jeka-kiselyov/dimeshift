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
		"keyup #input_goal_balance": "goalBalanceChanged",
		"change #input_start_currency": "recalculateStartCurrency",
		"change #input_goal_currency": "recalculateGoalCurrency",
		"click #set_goal_to_start": "setGoalCurrencyToStart"
	},
	title: function() {
		return 'Plan your expenses';
	},
	url: function() {
		return 'plan';
	},
	preparedData: {},
	idNew: false,
	addNew: function() {
		this.step = 1;
		this.preparedData = {};
		this.preparedData['start_datetime'] = (Date.now() / 1000 | 0);
		this.preparedData['goal_datetime'] = (Date.now() / 1000 | 0) + 24 * 60 * 60;
		this.preparedData['start_balance'] = 0;
		this.preparedData['goal_balance'] = 0;
		this.preparedData['start_currency'] = null;
		this.preparedData['goal_currency'] = null;
		this.preparedData['name'] = 'Undefined';

		this.isNew = true;

		this.render();
	},
	dateChanged: function(ev) {
		this.preparedData['goal_datetime'] = ev.date.unix();

		this.recalculatePreview();
	},
	goalBalanceChanged: function(ev) {
		var val = parseFloat($(ev.currentTarget).val(), 10);
		this.preparedData['goal_balance'] = val;

		this.recalculatePreview();
	},
	setGoalCurrencyToStart: function() {
		this.preparedData['goal_currency'] = this.preparedData['start_currency'];
		this.$('#input_goal_currency').val(this.preparedData['goal_currency']);

		this.recalculatePreview();
		this.recalculateStartBalance();
	},
	recalculateGoalCurrency: function() {
		var newCurrency = this.$('#input_goal_currency').val();
		this.preparedData['goal_currency'] = newCurrency;

		this.recalculatePreview();
		this.recalculateStartBalance();
	},
	recalculateStartBalance: function() {
		var balance = this.preparedData['start_balance'];
		var decimal = App.templateManager.modifiers.decimal(balance);
		var rational = App.templateManager.modifiers.rational(balance);

		$('#cb_decimal').text(decimal);
		$('#cb_rational').text(rational);

		$('#cb_c_other').text(this.preparedData['start_currency']);
		if (balance < 0)
			$('#cb_minus').show();
		else
			$('#cb_minus').hide();

		if (this.preparedData['start_currency'] == 'USD') {
			$('#cb_c_other').hide();
			$('#cb_c_dollar').show();
		} else {
			$('#cb_c_other').show();
			$('#cb_c_dollar').hide();
		}

		if (this.preparedData['start_currency'] != this.preparedData['goal_currency']) {
			$('#set_goal_to_start').show();
			$('#set_goal_to_start_c').text(this.preparedData['start_currency']); // @todo: currency name, not code

			var o_balance = App.exchange.convert(this.preparedData['start_balance'], this.preparedData['start_currency'], this.preparedData['goal_currency']);

			var o_decimal = App.templateManager.modifiers.decimal(o_balance);
			var o_rational = App.templateManager.modifiers.rational(o_balance);

			$('#cb_o_decimal').text(o_decimal);
			$('#cb_o_rational').text(o_rational);

			$('#cb_o_c_other').text(this.preparedData['goal_currency']);
			if (o_balance < 0)
				$('#cb_o_minus').show();
			else
				$('#cb_o_minus').hide();

			if (this.preparedData['goal_currency'] == 'USD') {
				$('#cb_o_c_other').hide();
				$('#cb_o_c_dollar').show();
			} else {
				$('#cb_o_c_other').show();
				$('#cb_o_c_dollar').hide();
			}

			$('#cb_o').show();
		} else {
			$('#cb_o').hide();
			$('#set_goal_to_start').hide();
		}
	},
	recalculatePreview: function() {
		var diff = this.preparedData['goal_balance'] - App.exchange.convert(this.preparedData['start_balance'], this.preparedData['start_currency'], this.preparedData['goal_currency']);
		var decimal = App.templateManager.modifiers.decimal(diff);
		var rational = App.templateManager.modifiers.rational(diff);

		$('#preview_diff_decimal').text(decimal);
		$('#preview_diff_rational').text(rational);
		if (diff < 0) {
			$('#preview_spend').show();
			$('#preview_get').hide();
		} else {
			$('#preview_spend').hide();
			$('#preview_get').show();
		}

		$('#preview_diff_c_other').text(this.preparedData['goal_currency']);
		if (this.preparedData['goal_currency'] == 'USD') {
			$('#preview_diff_c_other').hide();
			$('#preview_diff_c_dollar').show();
		} else {
			$('#preview_diff_c_other').show();
			$('#preview_diff_c_dollar').hide();
		}

		var days_diff = Math.ceil((this.preparedData['goal_datetime'] - this.preparedData['start_datetime']) / (24 * 60 * 60));
		$('#preview_days_count').text(days_diff);
		if (days_diff <= 1) {
			$('#preview_one_day').show();
			$('#preview_few_days').hide();
		} else {
			$('#preview_one_day').hide();
			$('#preview_few_days').show();
		}

		var per_day_diff = diff / days_diff;
		var per_day_decimal = App.templateManager.modifiers.decimal(per_day_diff);
		var per_day_rational = App.templateManager.modifiers.rational(per_day_diff);

		$('#preview_d_diff_decimal').text(per_day_decimal);
		$('#preview_d_diff_rational').text(per_day_rational);
		if (per_day_diff < 0)
			$('#preview_d_diff_minus').show();
		else
			$('#preview_d_diff_minus').hide();

		$('#preview_d_diff_c_other').text(this.preparedData['goal_currency']);
		if (this.preparedData['goal_currency'] == 'USD') {
			$('#preview_d_diff_c_other').hide();
			$('#preview_d_diff_c_dollar').show();
		} else {
			$('#preview_d_diff_c_other').show();
			$('#preview_d_diff_c_dollar').hide();
		}

	},
	recalculateStartCurrency: function() {
		var newCurrency = this.$('#input_start_currency').val();
		this.preparedData['start_balance'] = App.exchange.convert(this.preparedData['start_balance'], this.preparedData['start_currency'], newCurrency);
		this.preparedData['start_currency'] = newCurrency;

		this.recalculateStartBalance();
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

		if (this.preparedData['start_currency'] == null || this.preparedData['goal_currency'] == null) {
			/// guess start_currency
			this.preparedData['start_currency'] = 'USD'; //default
			this.preparedData['goal_currency'] = 'USD'; //default
			var possibleCurrencies = {};
			_.each(this.preparedData['wallets'], function(wallet_id) {
				var currency = that.wallets.get(wallet_id).get('currency');
				possibleCurrencies[currency] = (possibleCurrencies[currency] || 0) + 1;
			});
			var maxPossibleCurrency = null;
			var maxvalue = 0;
			_.each(possibleCurrencies, function(value, key) {
				if (maxPossibleCurrency == null || value > maxvalue) {
					maxvalue = value;
					maxPossibleCurrency = key;
				}
			});

			if (maxPossibleCurrency) {
				this.preparedData['start_currency'] = maxPossibleCurrency;
				this.preparedData['goal_currency'] = maxPossibleCurrency;
			}
		}

		if (this.isNew) {
			that.preparedData['start_balance'] = 0;
			_.each(this.preparedData['wallets'], function(wallet_id) {
				var currency = that.wallets.get(wallet_id).get('currency');
				var balance = that.wallets.get(wallet_id).getTotal();
				that.preparedData['start_balance'] += App.exchange.convert(balance, currency, that.preparedData['start_currency']);
			});
		}

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
				var datetime = that.preparedData['goal_datetime'];
				that.$('.datetimepicker').datetimepicker({
					inline: true,
					minDate: moment(),
					format: 'MM/dd/YYYY'
				})

				that.$('.datetimepicker').data("DateTimePicker").date(moment(datetime * 1000));
				that.recalculatePreview();
				that.recalculateStartBalance();
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
					App.exchange.loadRates(function() {
						that.render();
					});
				});
			});
		});
	}

});