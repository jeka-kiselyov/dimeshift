// wallet.js
App.Views.Pages.Wallet = App.Views.Abstract.Page.extend({

	templateName: 'pages/wallets/view',
    category: 'wallets',
	events: {
		"submit #add_transaction_form": "addExpense",
		"click #add_profit_button": "addProfit",
		"click #set_total_to_button": "setTotalTo"
	},
	title: function() {
		if (typeof(this.model) != 'undefined' && this.model.get('name'))
			return this.model.get('name');
		else
			return 'Wallet';
	},
	url: function() {
		if (typeof(this.model) != 'undefined' && this.model.id)
			return 'wallets/'+this.model.id;
	},
	setTotalTo: function()
	{
		App.showDialog('SetTotalTo', {wallet: this.model});
		return false;
	},
	addProfit: function()
	{
		App.showDialog('AddProfit', {wallet: this.model});
		return false;
	},
	addExpense: function()
	{
		var description = $("#add_transaction_text").val();
		var amount = $("#add_transaction_amount").val(); // could be empty if we are getting amount from description (1st try).

		console.log('Add transaction with description: '+description);

		var numbers = description.split(",").join(".").match(/[0-9.]+/g);
		var fromDescriptionAmount = false;
		if (typeof(numbers) !== 'undefined' && numbers && typeof(numbers[0]) !== 'undefined' && numbers[0])
		{
			fromDescriptionAmount = +numbers[0];
		}

		if (fromDescriptionAmount)
		{
			this.model.addExpense(fromDescriptionAmount, description);
			this.$('#add_transaction_amount').hide();
			$("#add_transaction_text").val('').blur();
		} else {
			amount = amount.split(',').join('.');
			amount = +amount;
			if (amount > 0)
			{
				this.model.addExpense(amount, description);
				this.$('#add_transaction_amount').hide();
				this.$("#add_transaction_text").val('').blur();
			} else {
				this.$('#add_transaction_amount').show();
				this.$('#add_transaction_amount').focus();
			}	
		}

		return false;
	},
	render: function() {
		console.log('views/pages/wallet.js | rendering');
		if (!this.partsInitialized)
			this.initializeParts();

		//// slide down invitation box if total is changed.
		if (App.currentUser.isDemo()) 
		{
			if (typeof(this.initialWalletTotal) !== 'undefined')
			{
				if (!$('#fill_profile_invitation').is(":visible"))
					if (this.model.get('total') != this.initialWalletTotal)
						$('#fill_profile_invitation').slideDown('slow');
			} else {
				this.initialWalletTotal = this.model.get('total');
			}
		}

		this.once('render',function(){
			for (var k in this.parts)
				this.parts[k].render();
			for (var k in this.charts)
				this.charts[k].render();
		});
		this.renderHTML({ item: this.model.toJSON() });
	},
	initializeParts: function() {
		console.info('views/pages/wallet.js | initializing parts');
		this.parts = [];
		this.parts.push(new App.Views.Parts.Transactions({id: 'transactions_container', model: this.model, collection: this.model.getTransactions()}));
		this.partsInitialized = true;

		this.charts = [];
		this.charts.push(new App.Views.Charts.Balance({id: 'balance_canvas', model: this.model}));
	},
	wakeUp: function() {
		console.log('views/pages/wallet.js | waking up');
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function(){
			that.render();
			that.listenTo(that.model, 'change sync destroy', that.render);
			for (var k in that.parts)
				if (typeof(that.parts[k].wakeUp) === 'function')
					that.parts[k].wakeUp();
		});
	},
	reloadWallet: function() {
		var wallet_id = this.model.id;
		var that = this;
		this.requireSingedIn(function(){
			var transactions = that.model.getTransactions();
			that.model = new App.Models.Wallet();
			that.model.id = wallet_id;
			that.model.transactions = transactions;
			that.model.transactions.fetch();
			
			that.listenTo(that.model, 'change sync destroy', that.render);
			
			that.model.fetch({error: function(){
				App.showPage('NotFound');
			}});	
		});
	},
	initialize: function(params) {
		console.log('views/pages/wallet.js | initializing');
		this.renderLoading();


		var that = this;
		this.requireSingedIn(function(){

			/// initialize models, collections etc. Request fetching from storage
			if (typeof(params.item) !== 'undefined')
			{
				that.model = params.item;
				that.render();
				that.listenTo(that.model, 'change sync destroy', that.render);
			} else if (typeof(params.id) !== 'undefined') 
			{
				that.model = new App.Models.Wallet();
				that.model.id = params.id;
				
				that.listenTo(that.model, 'change sync destroy', that.render);
				
				that.model.fetch({error: function(){
					App.showPage('NotFound');
				}});			
			} else
				throw 'id or item parameters required';

		});
	}

});