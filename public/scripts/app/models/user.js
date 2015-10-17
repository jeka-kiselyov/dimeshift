// user.js
App.Models.User = Backbone.Model.extend({

	validate: function(attrs, options) {
		var errors = [];

	    if (typeof(this.get('email')) !== 'string' || !isEmail(this.get('email')))
			errors.push({msg: 'Invalid email', attr: 'email'});
		else if (this.get('email').length > 255)
			errors.push({msg: 'Email is too long', attr: 'email'});

	    if (typeof(this.get('login')) !== 'string' || this.get('login').length < 2)
			errors.push({msg: 'Username is too short', attr: 'login'});
		else if (this.get('login').length > 255)
			errors.push({msg: 'Username is too long', attr: 'login'});

	    if (typeof(this.get('password')) !== 'string' || this.get('password').length < 6)
			errors.push({msg: 'Password is too short', attr: 'password'});

		if (errors.length)
			return errors;
	},
	defaults: {
        auth_code: null,
        email: null,
        password: null,
        is_demo: null,
        login: null,
    },
    getWallets: function() {
        if (typeof(this.wallets) === 'undefined')
        {
            this.wallets = new App.Collections.Wallets();
            this.wallets.setUserId(this.id);
        }
        return this.wallets;
    },







    url: function() {
		return App.settings.apiEntryPoint + 'users' + (typeof(this.id) === 'undefined' ? '' : '/'+this.id);
    },

    signedIn: false,
    signInError: null,

	isSignedIn: function() {
		return this.signedIn;
	},

	isAdmin: function() {
		return false;
	},

	isDemo: function() {
		return (this.get('is_demo') == true); // yep, ==
	},

    signInWithData: function(data) {
		if (typeof(data) !== 'undefined')
		{
			this.set(data);
			if (this.signedIn === false)
			{
				this.signedIn = true;
				this.trigger('signedInStatusChanged');
			}
		} else {
			if (this.signedIn === true)
			{
				this.signedIn = false;
				this.trigger('signedInStatusChanged');
			}
		}
    },
    demoRegister: function() {
		this.register('demo', 'demo@demo.com', 'demonstration');
    },
    changePassword: function(currentPassword, newPassword)
    {
		var that = this;

		this.set('current_password', currentPassword);
		this.set('password', newPassword);

		return this.save(null, {success: function(model, data){
			if (typeof(data.id) !== 'undefined')
			{
				console.log("Server side change password success");
				that.set('password', '');
				that.trigger('changed');
			}
		}, error: function(model, response){
			console.log("Server side change password error");
			if (typeof(response.responseJSON) !== 'undefined' && typeof(response.responseJSON.message) !== 'undefined')
			{
				if (!(that.validationError instanceof Array))
					that.validationError = [];
				for (var k in response.responseJSON.message)
					that.validationError.push({msg: response.responseJSON.message[k]});
			}
			that.trigger('invalid');
		}});
    },
    fillProfile: function(login, email, password) {
		var that = this;

		this.set('login', login);
		this.set('email', email);
		this.set('password', password);
		this.set('is_demo', false);

		return this.save(null, {success: function(model, data){
			if (typeof(data.id) !== 'undefined')
			{
				console.log("Server side fill profile success");
				that.set('password', '');
				that.trigger('filled');
			}
		}, error: function(model, response){
			console.log("Server side fill profile error");
			if (typeof(response.responseJSON) !== 'undefined' && typeof(response.responseJSON.message) !== 'undefined')
			{
				if (!(that.validationError instanceof Array))
					that.validationError = [];
				for (var k in response.responseJSON.message)
					that.validationError.push({msg: response.responseJSON.message[k]});
			}
			that.trigger('invalid');
		}});
	},
    register: function(login, email, password) {
		var that = this;

		this.set('login', login);
		this.set('email', email);
		this.set('password', password);

		return this.save(null, {success: function(model, data){
			if (typeof(data.id) !== 'undefined')
			{
				console.log("Server side registration success");
				that.set('password', '');
				that.trigger('registered');
				if (typeof(data.auth_code) !== 'undefined')
				{
					// And signed in
					that.signedIn = true;
					that.trigger('signedInStatusChanged');
					console.log("Server side registration - signed in");
				}
			}
		}, error: function(model, response){
			console.log("Server side registration error");
			if (typeof(response.responseJSON) !== 'undefined' && typeof(response.responseJSON.message) !== 'undefined')
			{
				if (!(that.validationError instanceof Array))
					that.validationError = [];
				for (var k in response.responseJSON.message)
					that.validationError.push({msg: response.responseJSON.message[k]});
			}
			that.trigger('invalid');
		}});
    },
    newPassword: function(code, hash, password)
    {
		var that = this;

		var url = App.settings.apiEntryPoint+'users/newpassword';

		this.clear();
		$.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            data: {code: code, hash: hash, password: password},
            success: function (data) {
				console.log('Success setting new password');
				that.trigger('newpassword:success');
            },
            error: function(data) {
				console.log('Error setting new password');

				that.validationError = [];
				if (typeof(data.responseJSON) != 'undefined' && typeof(data.responseJSON.code) != 'undefined' && typeof(data.responseJSON.message) != 'undefined')
					if (data.responseJSON.message instanceof Array)
					{
						for (var k in data.responseJSON.message)
							that.validationError.push({msg: data.responseJSON.message[k]});
					} else {
						that.validationError.push({msg: data.responseJSON.message});
					}

				that.trigger('newpassword:error');
            }
        });

        return true;
    },
    restorePassword: function(email) {
		var that = this;

		var url = App.settings.apiEntryPoint+'users/restore';

		this.clear();
		$.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            data: {email: email},
            success: function (data) {
				console.log('Success restoring password');
				that.trigger('restore:success');
            },
            error: function(data) {
				console.log('Error restoring password');

				that.validationError = [];
				if (typeof(data.responseJSON) != 'undefined' && typeof(data.responseJSON.code) != 'undefined' && typeof(data.responseJSON.message) != 'undefined')
					if (data.responseJSON.message instanceof Array)
					{
						for (var k in data.responseJSON.message)
							that.validationError.push({msg: data.responseJSON.message[k]});
					} else {
						that.validationError.push({msg: data.responseJSON.message});
					}

				that.trigger('restore:error');
            }
        });

        return true;
    },
	signIn: function(username, password) {

		var that = this;

		var url = App.settings.apiEntryPoint+'users/signin';

		$.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            data: {username: username, password: password},
            success: function (data) {
				if (typeof(data.auth_code) != 'undefined' && data.auth_code)
				{
					console.log('Logged in successfully');
					that.trigger('signedin');
					that.signInWithData(data);
				}
            },
            error: function(data) {
				console.log('Cannot log in');
				that.signInWithData();
				if (!(that.validationError instanceof Array))
					that.validationError = [];
				if (typeof(data.responseJSON) != 'undefined' && typeof(data.responseJSON.code) != 'undefined' && typeof(data.responseJSON.message) != 'undefined')
					for (var k in data.responseJSON.message)
						that.validationError.push({msg: data.responseJSON.message[k]});
				that.trigger('invalid');
            }
        });

        return true;
	},
	signOut: function() {
		var that = this;
		var url = App.settings.apiEntryPoint+'users/signout';

		if (!this.isSignedIn())
		{
			return false;
		}

		this.signedIn = false;
		this.clear().set(this.defaults);
        delete this.wallets;

		$.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            success: function (data) {
				console.log('Signed out');
				that.trigger('signedout');
				that.signInWithData();
            },
            error: function(data) {
				console.error('Error signing out');
            }
        });

        return true;
	}

});
