// log.js
App.log = {

	currentURL: null,
	currentTitle: null,
	currentVisitTime: null,
	hasToForce: false,
	setURL: function(url) {
		if (url != this.currentURL) {
			this.setUserId();
			this.hasToForce = true;
			this.currentURL = url;
			if (typeof(ga) === 'function') {
				ga('set', 'page', '/' + url);
			}
		}
	},
	setTitle: function(title) {
		if (title != this.currentTitle) {
			this.setUserId();
			this.currentTitle = title;
			this.hasToForce = true;
			if (typeof(ga) === 'function') {
				ga('set', 'title', title);
			}
		}
	},
	setUserId: function() {
		if (App && App.currentUser && App.currentUser.id && typeof(ga) === 'function')
			ga('set', '&uid', '' + App.currentUser.id);
	},
	pageView: function() {
		var time = Date.now();

		if (this.currentVisitTime === null || (time - this.currentVisitTime) > 1000 || this.hasToForce) /// 100 microseconds
		{
			this.setUserId();
			if (typeof(ga) === 'function') {
				ga('send', 'pageview');
			}

			this.hasToForce = false;
		}

		this.currentVisitTime = time;
	},
	event: function(category, action, label, count) {
		this.setUserId();
		if (typeof(label) === 'undefined')
			label = '';

		if (typeof(ga) === 'function') {
			if (typeof(count) !== 'undefined')
				ga('send', 'event', category, action, label, count);
			else
				ga('send', 'event', category, action, label);
		}
	}
};