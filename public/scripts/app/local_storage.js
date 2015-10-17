// local_storage.js
App.localStorage = {

	invalidate: function(currentVersion) {
		var prev = this.get('current_app_version');
		if (prev && currentVersion != prev)
			this.clear();
		this.set('current_app_version', currentVersion);
	},
	set: function(name, data) {
		if (typeof(data) === 'undefined')
			return this.remove(name);

		window.localStorage.setItem(name, this._serialize(data));
		return data;
	},
	get: function(name) {
		return this._deserialize(window.localStorage.getItem(name));
	},
	remove: function(name) {
		window.localStorage.removeItem(name);
		return true;
	},
	clear: function() {
		window.localStorage.clear();
		return true;
	},
	isSupported: function() {
		if (typeof(window) === 'undefined')
			return false;
		try {
			return ('localStorage' in window && window.localStorage);
		} catch(err) { return false; }

		return true;
	},
	_serialize: function(data) {
		return JSON.stringify(data);
	},
	_deserialize: function(data) {
		if (typeof data != 'string')
			return undefined;
		try {
			return JSON.parse(data);
		}
		catch(e) { return data || undefined; }
	}

};