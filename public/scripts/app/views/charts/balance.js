// balance.js
App.Views.Charts.Balance = Backbone.View.extend({

	events: {
	},
	chart: false,
	aTransactions: [],
	_data: {},
	dataReady: false,
	dataFetched: false,

	initialize: function() {
		if (!this.model || !this.id)
			console.error('views/charts/balance.js | model(wallet) and id of canvas should be provided for this view');

		this.model.on('addTransaction', this.appendTransaction, this);
		this.model.on('removeTransaction', this.removeTransaction, this);


		this.on('dataReady', function(){
			console.log('views/charts/balance.js | dataReady');

			if (typeof(this._data.labels) === 'undefined' || !this._data.labels || this._data.labels.length == 0)
				return; // @todo: show 'not enough data'

			var that = this;

			$('#'+that.id).fadeOut(20, function(){
				that.chart = new Chartist.Line('#'+that.id, that._data, {
					low: 0,
					lineSmooth: false,
					chartPadding: 0,
					fullWidth: false,
					showArea: true
				});

				$('#'+that.id).fadeIn(400);
			});

		});
	},
	appendTransaction: function(transaction) {
		this.aTransactions.push(transaction);
    	this.trigger('transactionsReady');
	},
	removeTransaction: function(transactionId) {
		this.aTransactions = _.filter(this.aTransactions, function(t){ return t.id != transactionId; });
    	this.trigger('transactionsReady');
	},
	getMissedTransactionsFromPage: function() {
		var isUpdated = false;
	},
	fetchTransactions: function() {
		if (this.aTransactions.length)
		{
			this.trigger('transactionsReady');
			return this.aTransactions;
		}

		var transactions = new App.Collections.Transactions();
		this.aTransactions = [];
        transactions.setWalletId(this.model.id);

        var that = this;
        transactions.once('sync',function(){
        	console.log('Synced current month');
        	transactions.forEach(function(t){
        		that.aTransactions.push(t);
        	});

        	transactions.once('sync',function(){
        	console.log('Synced prev month');
	        	transactions.forEach(function(t){
	        		that.aTransactions.push(t);
	        	});

	        	that.trigger('transactionsReady');
        	});
        	transactions.gotoPrev();
        });

        transactions.fetch();
	},
	fetchData: function() {
		if (this.dataFetched)
			return false;
		if (this.dataReady)
		{
        	this.trigger('dataReady');
			return this._data;
		}

		this.dataFetched = true;

		var that = this;
		this.on('transactionsReady',function(){
			console.log('views/charts/balance.js | transactionsReady');
			//// first step. Filter expenses
			var a = _.filter(this.aTransactions, function(t){ return t.get('amount') < 0; });
			//// second step. For each day
			var days = {};
			var curTime = new Date();
			var curDay = curTime.getDate();
			var curMonth = curTime.getMonth();
			var curYear = curTime.getYear();

			curTime = curTime.getTime();
			for (var i = 60; i >= 0; i--)
			{
				var d = new Date(curTime - 24*60*60*1000*i);
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getYear();

				var dayTotal = 0;
				_.each(a, function(t){
					var tDate = new Date(t.get('datetime')*1000);
					if (tDate.getDate() === day && tDate.getMonth() === month)
						dayTotal += Math.abs(t.get('amount'));
				});
				days[day+'-'+month] = {day: day, month: month, year: year, total: Math.abs(dayTotal)};
			}

			/// third step. Find first day from a set at which transaction occurs.
			var firstDay = 0;
			var firstMonth = 0;
			var firstYear = 0;
			_.each(days, function(day){
				if (day.total > 0)
				{
					if (firstDay == 0 && firstMonth == 0)
					{
						firstDay = day.day;
						firstMonth = day.month;
						firstYear = day.year;
					}

					if ((day.month < firstMonth && day.year == firstYear) || (day.day < firstDay && day.month == firstMonth))
					{
						firstDay = day.day;
						firstMonth = day.month;
						firstYear = day.year;
					}
				}
			});

			/// forth step. Fill days without transactions by values from next days started from firstDay
			if (firstDay)
			_.each(days, function(d){
				if (firstYear < d.year || (firstMonth < d.month && firstYear <= d.year) || (firstDay < d.day && firstMonth == d.month))
				{
					if (d.total == 0 && typeof(d.filledMissed) === 'undefined')
					{
						var foundTotal = 0;
						var foundEmpty = [];
						var iDay = d.day + 1;
						var iMonth = d.month;
						var iYear = d.year;
						foundEmpty.push(d.day+'-'+d.month);

						while ((foundTotal == 0) && ((curMonth == iMonth && curDay >= iDay) || (curYear == iYear && curMonth > iMonth) || curYear > iYear) )
						if (typeof(days[iDay+'-'+iMonth]) !== 'undefined')
						{

							if (days[iDay+'-'+iMonth].total == 0)
							{
								/// another empty day
								foundEmpty.push(iDay+'-'+iMonth);
							} else {
								/// day with total set
								foundEmpty.push(iDay+'-'+iMonth);
								foundTotal = days[iDay+'-'+iMonth].total;
							}

							iDay++;

						} else {
							/// next month
							iMonth++;
							iDay = 1;

							if (iMonth == 12)
							{
								iMonth = 0;
								iYear++;
							}
						}

						//// fill missed sum
						foundEmpty = _.uniq(foundEmpty);
						if (foundEmpty.length > 0)
						{
							var total = foundTotal / foundEmpty.length;
							_.each(foundEmpty, function(found){
								days[found].total = total;
								days[found].filledMissed = true;
							});
						}
					}
				}
			});

			/// fifth step. Filter days with total set and truncate to 30 max
			//days = _.filter(days, function(d){ return d.total > 0; });
			//days = _.last(days, 30);

			/// generate labels
			//days.reverse();
			var values = [];
			_.each(days, function(day, key){
				values.push({label: day.day+'/'+(day.month+1), value: day.total});
			});
			//values.reverse();
			values = _.last(values, 31);
			/// remove empty from the start
			var alreadyStarted = false;
			values = _.filter(values, function(item){ if (item.value > 0 || alreadyStarted) { alreadyStarted = true; return true; } else return false; });

			/// group by 
			if (values.length > 10)
			{
				var rvalues = [];
				var i = 0;
				if (values.length > 20)
				{
					/// by 3
					while (typeof(values[i]) !== 'undefined')
					{
						var rvalue = values[i].value;
						if (typeof(values[i+1]) !== 'undefined') rvalue+=values[i+1].value;
						if (typeof(values[i+2]) !== 'undefined') rvalue+=values[i+2].value;

						if (typeof(values[i+1]) !== 'undefined' && typeof(values[i+2]) !== 'undefined')
							rvalue = rvalue / 3;
						else if (typeof(values[i+1]) !== 'undefined')
							rvalue = rvalue / 2;

						var rlabel = values[i].label;
						if (typeof(values[i+2]) !== 'undefined') rlabel+=' - <br>'+values[i+2].label;
						else
						if (typeof(values[i+1]) !== 'undefined') rlabel+=' - <br>'+values[i+1].label;

						rvalues.push({label: rlabel, value: rvalue});
						i = i + 3;
					}
				} else {
					/// by 2
					while (typeof(values[i]) !== 'undefined')
					{
						var rvalue = values[i].value;
						if (typeof(values[i+1]) !== 'undefined') rvalue+=values[i+1].value;

						if (typeof(values[i+1]) !== 'undefined')
							rvalue = rvalue / 2;

						var rlabel = values[i].label;
						if (typeof(values[i+1]) !== 'undefined') rlabel+=' - <br>'+values[i+1].label;

						rvalues.push({label: rlabel, value: rvalue});
						i = i + 2;
					}
				}

				values = rvalues;
			}

			var labels = _.map(values, function(item){ return item.label; });
			var series = [[]];
			series[0] = _.map(values, function(item){ return item.value; });

			that._data = {labels: labels, series: series};
			that.dataFetched = false;

			that.dataReady = true;
        	that.trigger('dataReady');
		});
		this.fetchTransactions();
	},
	wakeUp: function() {
		this.render();
	},
	render: function() {
		console.log('Rendering chart');

		if (!$('#'+this.id).length)
			return;

		this.fetchData();
	}
});
