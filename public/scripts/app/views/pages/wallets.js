// wallets.js
App.Views.Pages.Wallets = App.Views.Abstract.Page.extend({

	templateName: 'pages/wallets/index',
    category: 'wallets',
	status: 'active',
	origin: 'both',
	events: {
		"mouseenter .item": "moreWalletDetails",
		"mouseleave .item": "lessWalletDetails",
		"click .item_button_remove": "removeItem",
		"click .item": "toItem",
		"click .item_button_edit": "editItem",
		"click .item_button_restore": "restoreItem",
		"click .item_button_accesses": "showAccesses",
		"click .filter_menu": "filter",
		"click .origin_menu": "filterOrigin"
	},
	title: function() {
		return 'Wallets';
	},
	url: function() {
		return 'wallets';
	},
	filter: function(ev) {
		var status = $(ev.currentTarget).data('status');
		if ((status == 'active' || status == 'hidden') && status != this.status)
		{
			this.status = status;
			this.render();
		}
		return false;
	},
	filterOrigin: function(ev) {
		var origin = $(ev.currentTarget).data('origin');
		if ((origin == 'both' || origin == 'mine' || origin == 'shared') && origin != this.origin)
		{
			this.origin = origin;
			this.render();
		}
		return false;
	},
	toItem: function(ev) {
		var data = $(ev.currentTarget).data();
		if (typeof(data.id) === 'undefined')
			return true;

		var id = parseInt(data.id, 10);
		var item = this.items.get(id);

		if (!item)
			return true;

		App.showPage('Wallet', {item: item});

		return false;
	},
	moreWalletDetails: function(ev) {
		$(ev.currentTarget).find(".item_buttons").show();
		//$(ev.currentTarget).find(".item_information").hide();
	},
	lessWalletDetails: function(ev) {
		$(ev.currentTarget).find(".item_buttons").hide();
		//$(ev.currentTarget).find(".item_information").show();
	},
	removeItem: function(ev) {
		var id = $(ev.currentTarget).parents('.item').data('id');
		App.showDialog('HideWallet', {item: this.items.get(id)});

		return false;
	},
	restoreItem: function(ev) {
		var id = $(ev.currentTarget).parents('.item').data('id');
		var item = this.items.get(id);
		if (item && item.get('status') == 'hidden')
		{
			item.set('status', 'active');
			item.save();
		}

		return false;
	},
	showAccesses: function(ev) {
		var id = $(ev.currentTarget).parents('.item').data('id');
		App.showDialog('WalletAccesses', {item: this.items.get(id)});

		return false;		
	},
	editItem: function(ev) {
		var id = $(ev.currentTarget).parents('.item').data('id');
		App.showDialog('EditWallet', {item: this.items.get(id)});

		return false;
	},
	render: function() {
		if (this.origin == 'both')
			var filtered = this.items.search({status: this.status});
		else
			var filtered = this.items.search({status: this.status, origin: this.origin}); 
		this.renderHTML({items: filtered.toJSON(), status: this.status, origin: this.origin});
	},
	wakeUp: function() {
		this.holderReady = false;
		var that = this;
		this.requireSingedIn(function(){
			that.render();
			that.listenTo(that.items, 'sync add change reset remove', that.render);
		});
	},
	initialize: function() {
		console.log('wallets.js | initialize');
		this.renderLoading();

		var that = this;
		this.requireSingedIn(function(){
			that.items = App.currentUser.getWallets();
			/// initialize models, collections etc. Request fetching from storage
			that.listenTo(that.items, 'sync', that.render);
			that.items.fetch().done(function(){
				that.listenTo(that.items, 'add change reset remove', that.render);
			}).error(function(){
				that.render();
			});
		});
	}

});