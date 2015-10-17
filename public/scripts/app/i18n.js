// i18n.js
App.i18n = {

	strings: {},
	loaded: false,
	setLanguage: function(languageCode) {
		this.languageCode = languageCode;
		this.loadStrings();
	},
	getLanguage: function(languageCode) {
		return this.languageCode;
	},
	translate: function(string, stringId) {
		if (typeof(stringId) == 'undefined')
			stringId = string;
		if (typeof(this.strings[stringId]) === 'undefined' || this.strings[stringId] === false)
			return string;
		else
			return this.strings[stringId];
	},
	translateDOM: function() {
		var that = this;
		$("[data-i18n]").each(function(){
			var string = $(this).data('i18n');
			string = that.translate(string);
			$(this).text(string);
		});
	},
	loadStrings: function() {

		var that = this;
		var process = function(data) {
			that.strings = data;
			that.loaded = true;
			that.translateDOM();
		};

		this.loaded = false;
		$.ajax({
			url: App.settings.apiEntryPoint + 'i18n/bycode/'+this.languageCode,
			data: {},
			success: process,
			dataType: 'json',
			mimeType: 'application/json',
			cache: true
		});
	}


};