// helper.js
App.helper = {

	loadedAdditionalScripts: {},
	loadAdditionalScripts: function(scripts, callback) {
		var that = this;
		var expectedScripts = {};

		var addLoadHandler = function(scriptObj, scriptURL) {
			scriptObj.onload = function() {
				that.loadAdditionalScripts[scriptURL] = true;
				expectedScripts[scriptURL] = false;

				for (var k in expectedScripts)
					if (expectedScripts[k]) {
						loadScript(k);
						return;
					}

				if (typeof(callback) === 'function')
					callback();
			};
		};

		var loadScript = function(src) {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			addLoadHandler(script, src);
			head.appendChild(script);
		};

		for (var k in scripts)
			expectedScripts[scripts[k]] = true;

		if (scripts.length > 0)
			loadScript(scripts[0]);
	}

};