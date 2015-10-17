// wallet_accesses.js
App.Views.Dialogs.WalletAccesses = App.Views.Abstract.Dialog.extend({

	status: 'loading',
	dialogName: 'wallet_accesses',
	events: {
		"submit form": "onSubmit",
		"click .item_button_remove_access": "removeAccess"
	},
	removeAccess: function(ev) {
		var data = $(ev.currentTarget).data();
		if (typeof(data.id) === 'undefined')
			return true;

		var id = parseInt(data.id, 10);
		var access = this.accesses.get(id);

		if (!access)
			return true;

		App.showDialog('RemoveAccess', {item: this.item, access: access});

		return false;
	},
	initialize: function(params) {
		if (typeof(params.item) != 'undefined')
			this.item = params.item;
		else
			throw 'Can not initialize dialog without param.item';

        this.accesses = new App.Collections.WalletsAccesses();
        this.accesses.setWalletId(this.item.id);
        this.listenTo(this.accesses, 'sync', this.loaded);

        this.accesses.fetch();

		var that = this;
		this.on('ready', function() {
			that.$('#input_email').focus();
		});
        this.show(this.data());
	},
	data: function() {
		var ret_accesses = [];

		if (this.accesses && this.accesses.length)
		for (var i = 0; i < this.accesses.length; i++)
		{
			var acc = this.accesses.at(i).toJSON();
			acc['gravatar']= this.accesses.at(i).getGravatarURL();
			ret_accesses.push(acc);
		}
		return {item: this.item.toJSON(), accesses: ret_accesses, status: this.status }
	},
	loaded: function() {
		this.status = 'ready';
		this.render();
	},
	render: function() {
		this.renderHTML(this.data());
	},
	onSubmit: function() {
		var that = this;

		var email = this.$('#input_email').val();
		if (!email)
			return false;

		var already = this.accesses.where({to_email: email});
		if (already && already.length)
		{
			$("#emails_with_access_"+already[0].id).animate({ opacity: 0.5 }, 500 ).animate({ opacity: 1 }, 500 );

			return false;
		}

		this.$('.btn-primary').button('loading');

		var access = new App.Models.WalletsAccess();
		access.set('to_email', email);
		access.set('wallet_id', this.item.id);
		access.save();
		this.accesses.add(access);
		//this.item.set('name', name);
		//this.item.save();

		//this.hide();

		return false;
	}
});