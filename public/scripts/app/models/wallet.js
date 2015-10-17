// wallet.js
App.Models.Wallet = Backbone.Model.extend({

	defaults: {
        name: null,
        type: null,
        status: 'active',
        total: null,
        currency: 'USD'
    },
    getTotal: function() {
		return parseFloat(this.get('total'),10);
    },
    url: function() {
		return App.settings.apiEntryPoint + 'wallets/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    },
    hide: function() {
        if (this.get('status') == 'active')
        {
            this.set('status', 'hidden');
            this.save();
        }
        else if (this.get('status') == 'hidden')
        {
            this.destroy();
        }
    },
    getTransactions: function() {
        if (typeof(this.transactions) === 'undefined')
        {
            this.transactions = new App.Collections.Transactions();
            this.transactions.setWalletId(this.id);

            var that = this;
            this.transactions.fetch().done(function(){
            });
        }
        this.transactions.setWalletId(this.id);
        return this.transactions;
    },
    addProfit: function(amount, description) {

        var profit = new App.Models.Transaction();
        var amountValue = Math.abs(parseFloat(amount, 10));
        amountValue = Math.round(amountValue * 100) / 100;

        profit.set('description', description);
        profit.set('amount', amountValue);
        profit.set('wallet_id', this.id);

        profit.save();

        this.getTransactions().add(profit);
        this.set('total', this.getTotal()+amountValue);
        this.trigger('addTransaction', profit);
        //this.trigger('change');
    },
    setTotalTo: function(total) {
        var transaction = new App.Models.Transaction();
        var totalValue = Math.abs(parseFloat(total, 10));
        totalValue = Math.round(totalValue * 100) / 100;

        transaction.set('amount', totalValue);
        transaction.set('subtype', 'setup');
        transaction.set('wallet_id', this.id);

        transaction.save();
        this.getTransactions().add(transaction);
        this.set('total', totalValue);
        this.trigger('addTransaction', transaction);
        //this.trigger('change');
    },
    addExpense: function(amount, description) {

        var expense = new App.Models.Transaction();
        var amountValue = -Math.abs(parseFloat(amount, 10));
        amountValue = Math.round(amountValue * 100) / 100;

        expense.set('description', description);
        expense.set('amount', amountValue);
        expense.set('wallet_id', this.id);

        expense.save();

        this.getTransactions().add(expense);
        this.set('total', this.getTotal()+amountValue);
        this.trigger('addTransaction', expense);
        //this.trigger('change');
    },
    removeTransaction: function(transaction) {
        var newTotal = this.get('total') - transaction.get('amount');
        var transactionId = transaction.id;

        this.getTransactions().remove(transaction);
        transaction.destroy();
        this.set('total', newTotal);
        this.trigger('removeTransaction', transactionId);
    }

});
