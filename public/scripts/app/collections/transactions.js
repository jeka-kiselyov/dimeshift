//transactions.js
App.Collections.Transactions = Backbone.Collection.extend({

	model: App.Models.Transaction,
	wallet_id: false,
    state: 'loading',
    periodMonth: false,
    periodYear: false,
	comparator: function(item) {
		return -item.get('datetime'); // Note the minus!
	},
    url: function() {
		if (this.wallet_id)
			return App.settings.apiEntryPoint + 'wallets/' + this.wallet_id + '/transactions/'+this.periodToGETParams();
		else
			return App.settings.apiEntryPoint + 'transactions/'+this.periodToGETParams();
    },
    periodToReadableFormat: function(month, year) {
        var monthNames = [ "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December" ];

        if (typeof(month) == 'undefined' || typeof(year) == 'undefined')
        {
            if (!this.periodMonth || !this.periodYear)
                this.setPeriod();

            return App.i18n.translate(monthNames[this.periodMonth-1])+' '+this.periodYear;
        } else {
            return App.i18n.translate(monthNames[month-1])+' '+year;
        }
    },
    nextPeriodToReadableFormat: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();
        var month = this.periodMonth + 1;
        var year = this.periodYear;
        if (month == 13)
        {
            year++;
            month = 1;
        }

        return this.periodToReadableFormat(month, year);
    },
    prevPeriodToReadableFormat: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();
        var month = this.periodMonth - 1;
        var year = this.periodYear;
        if (month == 0)
        {
            year--;
            month = 12;
        }

        return this.periodToReadableFormat(month, year);
    },
    currentPeriodToReadableFormat: function() {
        var d = new Date();
        return this.periodToReadableFormat(d.getMonth() + 1, d.getFullYear());
    },
    diffToCurrentPeriod: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();

        var d = new Date();
        var curMonth = d.getMonth() + 1;
        var curYear = d.getFullYear();

        return (curMonth - this.periodMonth) + (curYear - this.periodYear)*12;
    },
    periodToGETParams: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();

        if (this.periodMonth < 12)  /// don't forget that the month is 0 based for new Date, but 1 based in periodMonth
            var to = (new Date(this.periodYear, this.periodMonth, 1, 0, 0, 0, 0)).getTime() / 1000 - 1;
        else
            var to = (new Date(this.periodYear+1, 0, 1, 0, 0, 0, 0)).getTime() / 1000 - 1;

        var from = (new Date(this.periodYear, this.periodMonth-1, 1, 0, 0, 0, 0)).getTime() / 1000;

        return '?to='+to+'&from='+from;
    },
    setWalletId: function(wallet_id) {
		this.wallet_id = wallet_id;
    },
    hasNextPeriod: function() {
        if (this.periodMonth == false || this.periodYear == false)
            return false;
        var d = new Date(); /// don't forget that the month is 0 based for new Date, but 1 based in periodMonth
        if (this.periodYear < d.getFullYear() || (this.periodYear == d.getFullYear() && this.periodMonth < d.getMonth()+1) )
            return true;
        return false;
    },
    hasPrevPeriod: function() {
        if (this.periodMonth == false || this.periodYear == false)
            return true;
        var d = new Date();
        if (this.periodYear <= 1970 )
            return false;
        return true;
    },
    nextPeriod: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();
        if (!this.hasNextPeriod())
            return false;

        this.periodMonth ++;
        if (this.periodMonth > 12)
        {
            this.periodMonth = 1;
            this.periodYear++;
        }

        return true;
    },
    currentPeriod: function() {
        if (!this.periodMonth || !this.periodYear)
        {
            this.setPeriod();
            return true;
        }

        if (!this.hasNextPeriod())
            return false;

        var d = new Date();
        var curMonth = d.getMonth() + 1;
        var curYear = d.getFullYear();
        this.periodMonth = curMonth;
        this.periodYear = curYear;

        return true;
    },
    prevPeriod: function() {
        if (!this.periodMonth || !this.periodYear)
            this.setPeriod();
        if (!this.hasPrevPeriod())
            return false;

        this.periodMonth--;
        if (this.periodMonth < 1)
        {
            this.periodMonth = 12;
            this.periodYear--;
        }

        return true;
    },
    setPeriod: function(month, year) {
        if (typeof(month) == 'undefined')
        {
            var d = new Date();
            this.periodMonth = d.getMonth() + 1; 
        } else {
            if (month >= 1 && month <= 12)
                this.periodMonth = month;
            else
                console.error('Invalid month parameter');
        }

        if (typeof(year) == 'undefined')
        {
            var d = new Date();
            this.periodYear = d.getFullYear(); 
        } else {
            if (year >= 1970)
                this.periodYear = year;
            else
                console.error('Invalid year parameter');
        }
    },
    gotoNext: function() {
        if (this.nextPeriod())
        {
            this.fetch();
            this.trigger('changedperiod');
            return true;
        }
        return false;        
    },
    gotoPrev: function() {
        if (this.prevPeriod())
        {
            this.fetch();
            this.trigger('changedperiod');
            return true;
        }
        return false;        
    },
    gotoCurrent: function() {
        if (this.currentPeriod())
        {
            this.fetch();
            this.trigger('changedperiod');
            return true;
        }
        return false;        
    },
    initialize: function() {
        this.state = 'loading';
        this.on('request', function(){
            this.state = 'loading';
        }, this);
        this.on('sync', function(){
            this.state = 'ready';
        }, this);
    }
});



