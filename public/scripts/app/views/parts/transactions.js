// transactions.js
App.Views.Parts.Transactions = Backbone.View.extend({

	templateName: 'parts/transactions',
	el: $("#comments_container"),
	events: {
		"click .item": "transactionDetails",
		"click #goto_next": "gotoNext",
		"click #goto_prev": "gotoPrev",
		"click #goto_current": "gotoCurrent"
	},
	gotoNext: function()
	{
		this.collection.gotoNext();
	},
	gotoPrev: function()
	{
		this.collection.gotoPrev();
	},
	gotoCurrent: function()
	{
		this.collection.gotoCurrent();
	},
	transactionDetails: function(ev) 
	{
		console.log('views/parts/transactions.js | Show transactions details');
		var data = $(ev.currentTarget).data();
		if (typeof(data.id) === 'undefined')
			return true;

		var id = parseInt(data.id, 10);
		var item = this.collection.get(id);

		if (!item)
			return true;

		App.showDialog('TransactionDetails', {item: item, wallet: this.model});

		return false;
	},

	initialize: function() {
		console.log('views/parts/transactions.js | Initializing Transactions view');
		if (!this.model || !this.collection)
			console.error('views/parts/transactions.js | model && collection && id should be provided for this view');

		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'changedperiod', this.fadeOut);	
	},
	wakeUp: function() {
		console.error('views/parts/transactions.js | Waking up');
		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'changedperiod', this.fadeOut);			
	},
	fadeOut: function() {
		this.$('#transactions_container').fadeTo(1, 0.5);
	},
	render: function() {
		console.log('views/parts/transactions.js | Rendering, state = '+this.collection.state);
		this.setElement($('#'+this.id));
		this.$('#transactions_container').fadeTo(1, 1);

		var data = {state: this.collection.state, collection: this.collection, transactions: this.collection.sort().toJSON(), item: this.model.toJSON()};
		var that = this;
		App.templateManager.fetch(this.templateName, data, function(html) {

			that.$el.html(html);
			that.trigger('render');
			that.trigger('loaded');
		});		
	}
});
