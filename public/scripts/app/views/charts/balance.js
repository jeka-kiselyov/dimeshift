// balance.js
App.Views.Charts.Balance = Backbone.View.extend({

	events: {},
	chart: false,
	aTransactions: [],
	_data: {},
	dataReady: false,
	dataFetched: false,
	libReady: false,

	drawChart: function() {
		var that = this;
		$('#' + that.id).fadeOut(20, function() {
			var options = {
				title: 'Expenses',
				curveType: 'function',
				legend: {
					position: 'none'
				},
				width: that.containerWidth,
				height: that.containerHeight,
				chartArea: {
					left: 0,
					top: 0,
					width: that.containerWidth,
					height: '85%'
				},
				colors: ['#a94442'],
				vAxis: {
					textPosition: 'in',
					viewWindow: {
						min: 0
					}
				},
				hAxis: {
					minValue: 0,
					baseline: 0,
					textStyle: {
						fontSize: 8
					},
					// ticks: [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
					slantedTextAngle: 30,
					maxAlternation: 1,
					slantedText: true
				}
			};
			var chart = new google.visualization.LineChart(document.getElementById(that.id));
			chart.draw(google.visualization.arrayToDataTable(that._data), options);
			$('#' + that.id).fadeIn(400);
		});
	},
	initialize: function() {
		if (!this.model || !this.id)
			console.error('views/charts/balance.js | model(wallet) and id of canvas should be provided for this view');

		var that = this;

		google.load('visualization', '1.0', {
			'packages': ['corechart'],
			'callback': function() {
				/// visualization library loaded
				that.trigger('libReady');
				that.libReady = true;
			}
		});

		this.model.on('addTransaction', this.appendTransaction, this);
		this.model.on('removeTransaction', this.removeTransaction, this);

		this.on('dataReady', function() {
			console.log('views/charts/balance.js | dataReady');

			if (that.libReady)
				that.drawChart();
			else
				that.once('libReady', that.drawChart);
		});
	},
	resize: function() {
		if (typeof(this.__resizeThrottled) === 'undefined') {
			var that = this;
			this.__resizeThrottled = _.throttle(function() {
				if (that.libReady && that.dataReady)
					that.drawChart();
			}, 100);
		}

		this.containerWidth = $('#balance_canvas').width();
		this.containerHeight = $('#balance_canvas').height();
		this.__resizeThrottled();
	},
	appendTransaction: function(transaction) {
		this.aTransactions.push(transaction);
		this.trigger('transactionsReady');
	},
	removeTransaction: function(transactionId) {
		this.aTransactions = _.filter(this.aTransactions, function(t) {
			return t.id != transactionId;
		});
		this.trigger('transactionsReady');
	},
	getMissedTransactionsFromPage: function() {
		var isUpdated = false;
	},
	fetchTransactions: function() {
		if (this.aTransactions.length) {
			this.trigger('transactionsReady');
			return this.aTransactions;
		}

		var transactions = new App.Collections.Transactions();
		this.aTransactions = [];
		transactions.setWalletId(this.model.id);

		var that = this;
		transactions.once('sync', function() {
			console.log('Synced current month');
			transactions.forEach(function(t) {
				that.aTransactions.push(t);
			});

			transactions.once('sync', function() {
				console.log('Synced prev month');
				transactions.forEach(function(t) {
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
		if (this.dataReady) {
			this.trigger('dataReady');
			return this._data;
		}

		this.dataFetched = true;

		var that = this;
		this.on('transactionsReady', function() {
			console.log('views/charts/balance.js | transactionsReady');
			//// first step. Filter expenses
			var a = _.filter(this.aTransactions, function(t) {
				return t.get('amount') < 0;
			});
			//// second step. For each day
			var days = {};
			var curTime = new Date();
			var curDay = curTime.getDate();
			var curMonth = curTime.getMonth();
			var curYear = curTime.getYear();

			curTime = curTime.getTime();
			for (var i = 60; i >= 0; i--) {
				var d = new Date(curTime - 24 * 60 * 60 * 1000 * i);
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getYear();

				var dayTotal = 0;
				_.each(a, function(t) {
					var tDate = new Date(t.get('datetime') * 1000);
					if (tDate.getDate() === day && tDate.getMonth() === month)
						dayTotal += Math.abs(t.get('amount'));
				});
				days[day + '-' + month] = {
					day: day,
					month: month,
					year: year,
					total: Math.abs(dayTotal)
				};
			}

			/// third step. Find first day from a set at which transaction occurs.
			var firstDay = 0;
			var firstMonth = 0;
			var firstYear = 0;
			_.each(days, function(day) {
				if (day.total > 0) {
					if (firstDay == 0 && firstMonth == 0) {
						firstDay = day.day;
						firstMonth = day.month;
						firstYear = day.year;
					}

					if ((day.month < firstMonth && day.year == firstYear) || (day.day < firstDay && day.month == firstMonth)) {
						firstDay = day.day;
						firstMonth = day.month;
						firstYear = day.year;
					}
				}
			});

			/// forth step. Fill days without transactions by values from next days started from firstDay
			if (firstDay)
				_.each(days, function(d) {
					if (firstYear < d.year || (firstMonth < d.month && firstYear <= d.year) || (firstDay < d.day && firstMonth == d.month)) {
						if (d.total == 0 && typeof(d.filledMissed) === 'undefined') {
							var foundTotal = 0;
							var foundEmpty = [];
							var iDay = d.day + 1;
							var iMonth = d.month;
							var iYear = d.year;
							foundEmpty.push(d.day + '-' + d.month);

							while ((foundTotal == 0) && ((curMonth == iMonth && curDay >= iDay) || (curYear == iYear && curMonth > iMonth) || curYear > iYear))
								if (typeof(days[iDay + '-' + iMonth]) !== 'undefined') {

									if (days[iDay + '-' + iMonth].total == 0) {
										/// another empty day
										foundEmpty.push(iDay + '-' + iMonth);
									} else {
										/// day with total set
										foundEmpty.push(iDay + '-' + iMonth);
										foundTotal = days[iDay + '-' + iMonth].total;
									}

									iDay++;

								} else {
									/// next month
									iMonth++;
									iDay = 1;

									if (iMonth == 12) {
										iMonth = 0;
										iYear++;
									}
								}

								//// fill missed sum
							foundEmpty = _.uniq(foundEmpty);
							if (foundEmpty.length > 0) {
								var total = foundTotal / foundEmpty.length;
								_.each(foundEmpty, function(found) {
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
			_.each(days, function(day, key) {
				values.push({
					label: day.day + '/' + (day.month + 1),
					value: day.total
				});
			});
			//values.reverse();
			values = _.last(values, 31);
			/// remove empty from the start
			var alreadyStarted = false;
			values = _.filter(values, function(item) {
				if (item.value > 0 || alreadyStarted) {
					alreadyStarted = true;
					return true;
				} else return false;
			});

			/// group by 
			// if (values.length > 10) {
			// 	var rvalues = [];
			// 	var i = 0;
			// 	if (values.length > 20) {
			// 		/// by 3
			// 		while (typeof(values[i]) !== 'undefined') {
			// 			var rvalue = values[i].value;
			// 			if (typeof(values[i + 1]) !== 'undefined') rvalue += values[i + 1].value;
			// 			if (typeof(values[i + 2]) !== 'undefined') rvalue += values[i + 2].value;

			// 			if (typeof(values[i + 1]) !== 'undefined' && typeof(values[i + 2]) !== 'undefined')
			// 				rvalue = rvalue / 3;
			// 			else if (typeof(values[i + 1]) !== 'undefined')
			// 				rvalue = rvalue / 2;

			// 			var rlabel = values[i].label;
			// 			if (typeof(values[i + 2]) !== 'undefined') rlabel += ' - <br>' + values[i + 2].label;
			// 			else
			// 			if (typeof(values[i + 1]) !== 'undefined') rlabel += ' - <br>' + values[i + 1].label;

			// 			rvalues.push({
			// 				label: rlabel,
			// 				value: rvalue
			// 			});
			// 			i = i + 3;
			// 		}
			// 	} else {
			// 		/// by 2
			// 		while (typeof(values[i]) !== 'undefined') {
			// 			var rvalue = values[i].value;
			// 			if (typeof(values[i + 1]) !== 'undefined') rvalue += values[i + 1].value;

			// 			if (typeof(values[i + 1]) !== 'undefined')
			// 				rvalue = rvalue / 2;

			// 			var rlabel = values[i].label;
			// 			if (typeof(values[i + 1]) !== 'undefined') rlabel += ' - <br>' + values[i + 1].label;

			// 			rvalues.push({
			// 				label: rlabel,
			// 				value: rvalue
			// 			});
			// 			i = i + 2;
			// 		}
			// 	}

			// 	values = rvalues;
			// }

			var labels = _.map(values, function(item) {
				return item.label;
			});
			var series = [
				[]
			];
			series[0] = _.map(values, function(item) {
				return item.value;
			});

			that._data = [];
			that._data.push(['Date', 'Amount']);
			for (var k in values)
				that._data.push([values[k].label, values[k].value]);

			that.dataFetched = false;

			that.dataReady = true;
			that.trigger('dataReady');
		});
		this.fetchTransactions();
	},
	wakeUp: function() {
		this.render();
	},
	sleep: function() {
		$(window).off('resize');
	},
	render: function() {
		console.log('Rendering chart');

		if (!$('#' + this.id).length)
			return;

		var that = this;
		that.resize();
		$(window).on('resize', function() {
			that.resize();
		});

		this.fetchData();
	}
});