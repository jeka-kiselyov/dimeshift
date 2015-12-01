// i18n.js
App.i18n = {

	strings: {},
	loaded: false,
	setLanguage: function(languageCode, callback) {
		this.languageCode = languageCode;
		App.localStorage.set('selected_interface_locale', languageCode);
		this.loadStrings(callback);
	},
	getLanguage: function(languageCode) {
		return this.languageCode;
	},
	translate: function(string, stringId) {
		if (typeof(stringId) == 'undefined')
			stringId = string;
		if (typeof(this.strings[stringId]) === 'undefined' || this.strings[stringId] === false || this.strings[stringId] === '')
			return string;
		else
			return this.strings[stringId];
	},
	translateDOM: function() {
		var that = this;
		$("[data-i18n]").each(function() {
			var string = $(this).data('i18n');
			string = that.translate(string);
			$(this).text(string);
		});
		$("[data-i18nvalue]").each(function() {
			var string = $(this).data('i18nvalue');
			string = that.translate(string);
			$(this).val(string);
		});
		$("[data-i18nplaceholder]").each(function() {
			var string = $(this).data('i18nplaceholder');
			string = that.translate(string);
			$(this).attr('placeholder', string);
		});
	},
	loadStrings: function(callback) {

		var that = this;
		var process = function(data) {
			console.log(data);
			that.strings = data;
			that.loaded = true;
			that.translateDOM();

			if (typeof(callback) == 'function')
				callback();
		};

		this.loaded = false;

		if (this.languageCode == 'default')
			process({});
		else
			$.ajax({
				url: App.settings.apiEntryPoint + 'i18n/bycode/' + this.languageCode.split('-').join(''),
				data: {},
				success: process,
				dataType: 'json',
				mimeType: 'application/json',
				cache: true
			});
	}


};