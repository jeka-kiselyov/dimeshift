// plan.js
App.Views.Pages.Plan = App.Views.Abstract.Page.extend({

	templateName: 'pages/plan/index',
	category: 'plan',
	additionalScripts: [
		'/vendors/moment/min/moment.min.js',
		'/vendors/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
	],
	events: {},
	title: function() {
		return 'Plan your expenses';
	},
	url: function() {
		return 'plan';
	},
	render: function() {
		var that = this;
		this.once('render', function() {
			that.$('.datetimepicker').datetimepicker({
				inline: true,
				format: 'MM/dd/YYYY'
			});
		});

		this.renderHTML({});
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
				that.render();
			});
		});
	}

});