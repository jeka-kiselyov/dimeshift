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
        return parseFloat(this.get('total'), 10);
    },
    url: function() {
        return App.settings.apiEntryPoint + 'wallets/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    },
    hide: function() {
        if (this.get('status') == 'active') {
            this.set('status', 'hidden');
            this.save();
        } else if (this.get('status') == 'hidden') {
            this.destroy();
        }
    },
    getTransactions: function() {
        if (typeof(this.transactions) === 'undefined') {
            this.transactions = new App.Collections.Transactions();
            this.transactions.setWalletId(this.id);

            var that = this;
            this.transactions.fetch().done(function() {});
        }
        this.transactions.setWalletId(this.id);
        return this.transactions;
    },
    getPlans: function() {
        if (typeof(this.plans) === 'undefined') {
            this.plans = new App.Collections.Plans();
            this.plans.setWalletId(this.id);

            var that = this;
            this.plans.fetch().done(function() {
                that.trigger('plansloaded');
            });
        }
        this.plans.setWalletId(this.id);
        return this.plans;
    },
    getTransactionsForPeriod: function(from, to, callback) {
        var deferred = jQuery.Deferred();

        var transactions = new App.Collections.Transactions();
        var aTransactions = [];
        transactions.setWalletId(this.id);

        var fromDate = new Date(from * 1000);
        var fromMonth = fromDate.getMonth() + 1;
        var fromYear = fromDate.getFullYear();

        var toDate = new Date(to * 1000);
        var toMonth = toDate.getMonth() + 1;
        var toYear = toDate.getFullYear();

        var curMonth = fromMonth;
        var curYear = fromYear;

        var fetched = function() {
            transactions.forEach(function(t) {
                if (t.get('datetime') >= from && t.get('datetime') <= to)
                    aTransactions.push(t);
            });

            fetchNext();
        };

        var fetch = function() {
            transactions.setPeriod(curMonth, curYear);
            transactions.fetch().done(fetched);
        };

        var fetchNext = function() {
            if (curMonth >= toMonth && curYear >= toYear) {
                if (typeof(callback) === 'function')
                    callback(aTransactions);
                deferred.resolve(aTransactions);
                return false;
            }

            curMonth++;
            if (curMonth > 12) {
                curMonth = 1;
                curYear++;
            }

            fetch();

            return true;
        };

        fetch();

        return deferred;
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
        this.set('total', this.getTotal() + amountValue);
        this.trigger('addTransaction', profit);
        //this.trigger('change');
    },
    setTotalTo: function(total) {
        var transaction = new App.Models.Transaction();
        var totalValue = parseFloat(total, 10);
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
        this.set('total', this.getTotal() + amountValue);
        this.trigger('addTransaction', expense);
        this.trigger('addExpense');
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