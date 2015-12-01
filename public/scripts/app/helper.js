// helper.js
App.helper = {

	loadedAdditionalScripts: {},
	loadAdditionalScripts: function(scripts, callback) {
		var that = this;
		var expectedScripts = {};
		var addLoadHandler = function(scriptObj, scriptURL) {
			script.onload = function() {
				that.loadAdditionalScripts[scriptURL] = true;
				expectedScripts[scriptURL] = false;
				var stillWaiting = false;
				for (var k in expectedScripts)
					if (expectedScripts[k])
						stillWaiting = true;

				if (!stillWaiting && typeof(callback) === 'function')
					callback();
			}
		}

		for (var k in scripts) {
			expectedScripts[scripts[k]] = true;
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scripts[k];
			addLoadHandler(script, scripts[k]);
			head.appendChild(script);
		}
	}

}