// template_manager.js
App.templateManager = {

	_cache: {},
	_templates: {},
	_loadingStates: {},
	_loadingCallbacks: {},
	_initialized: false,

	initialize: function()
	{
	    jSmart.prototype.getTemplate = function(name)
	    {
	    	if (name.indexOf('shared/widgets/') === 0)
	    	{
	    		/// It's a widget!
	    		var widgetName = name.split('shared/widgets/').join('').split('.tpl').join('');
	    		console.log('template_manager.js | Including widget "'+widgetName+'"');

	    		return '<div class="widget client-side-widget client-side-widget-'+widgetName+'" id="widget_'+(Math.random()+'').split('0.').join('')+'" data-widget-name="'+widgetName+'"></div>';
	    	}

	    	if (typeof(App.templateManager._templates[name]) !== 'undefined')
	    	{
	    		return App.templateManager._cache[name];
	    	} else {
		        throw new Error('Template ' + name + ' is not yet loaded');	    		
	    	}
	    };

		jSmart.prototype.registerPlugin(
			'modifier',
			'decimal',
			function(s)
			{
				var n = +((s+'').replace(/^\s+|\s+$/g, ''));
				var decimal = Math.abs(n) - Math.floor(Math.abs(n));
				decimal*=100;
				decimal = Math.round(decimal);
				if (decimal === 0)
					return '00';
				if (decimal < 10)
					return '0'+decimal;
				else
					return decimal;
			}
	    );

		jSmart.prototype.registerPlugin(
			'modifier',
			'rational',
			function(s)
			{
				var n = +((s+'').replace(/^\s+|\s+$/g, ''));
				var rational = Math.floor(Math.abs(n));
				return rational;
			}
	    );

		Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}};

		jSmart.prototype.registerPlugin(
		    'modifier',
		    'date_format',
		    function(s, fmt, defaultDate)
		    {
		    	var date = new Date(s*1000);
		        return date.format(fmt?fmt:'M j, Y', s?s:defaultDate);
		    }
		);

		jSmart.prototype.registerPlugin(
		    'modifier',
		    'wallet_time',
		    function(s)
		    {
		    	var date = new Date(s*1000);

		    	if (App.settings.timeFormat == '12')
			        return date.format('g:i a', s);
			    else
			        return date.format('H:i', s);	
		    }
		);

		jSmart.prototype.registerPlugin(
		    'modifier',
		    'wallet_date',
		    function(s)
		    {
		    	var date = new Date(s*1000);

		    	if (App.settings.dateFormat == 'mdy')
			        return date.format('M j, Y', s);
			    else
			    {
			    	var monthName = date.format('F', s).toLowerCase();
			        return date.format('j', s)+' '+App.i18n.translate(monthName)+' '+date.format('Y', s);	
			    }
		    }
		);

	    jSmart.prototype.registerPlugin(
	        'block',
	        't',
	        function(params, content, data, repeat)
	        {
	        	if (typeof(App) === 'undefined' || typeof(App.i18n) === 'undefined')
	        		return content;
	        	else
	        		return App.i18n.translate(content);
	        }
	    );

	    this._initialized = true;
	},
	commonData: function()
	{
		return {
			settings: _.extend(App.settings, 
				{site_path: App.settings.sitePath, client_side: true, invite_mode: App.settings.inviteMode})
		};
	},
	fetch: function(name, data, success) {

		if (!this._initialized)
			this.initialize();

		data = _.extend(data, this.commonData());

		if (typeof(this._templates[name]) !== 'undefined' || this.tryToLoadFromStorage(name))
		{
			var res = this._templates[name].fetch(data);
			if (typeof(success) === 'function')
				success(res);
			return res;
		}

		var that = this;

		if (typeof(success) === 'function')
		{
			if (typeof(this._loadingStates[name]) !== 'undefined' && this._loadingStates[name] === 'loading')
			{
				// already fetched
				if (typeof(this._loadingCallbacks[name]) === 'undefined')
				{
					this._loadingCallbacks[name] = [];
				}

				this._loadingCallbacks[name].push(function(tpl){
					success(tpl.fetch(data));
				});
				
			} else {
				// fetch template
				this.loadFromServer(name, function(tpl) {
					success(tpl.fetch(data));
				});
			}

		} else {
			this.loadFromServer(name);
		}

		return false;
	},
	tryToLoadFromStorage: function(name)
	{
		if (!App.settings.enableTemplatesCache)
		{
			console.log('Templates cache is disabled');
			return false;
		}

		if (!App.localStorage.isSupported())
		{
			console.log('Local storage is disabled');
			return false;
		}

		var data = App.localStorage.get('app_temapltes_'+name);
		if (data)
		{
			this._cache[name] = data;
			this._templates[name] = new jSmart(data);
			this._loadingStates[name] = 'ready';

			return true;
		}

		return false;
	},
	loadFromServer: function(name, callback) {

		this._loadingStates[name] = 'loading';
		var that = this;
		var templateName = name;
		var callbackFunc = callback;

		console.time("template_manager.js | Fetch "+templateName+" from server");

		var process = function(data)
		{
			console.timeEnd("template_manager.js | Fetch "+templateName+" from server");
			console.group("Template name: "+templateName);
			console.log("Callback function present: "+typeof(callbackFunc));
			if (typeof(that._loadingCallbacks[templateName]) === 'undefined')
				console.log("No additional callbacks");
			else
				console.log("Additional callbacks: "+that._loadingCallbacks[templateName].length);
			console.groupEnd();

			if (data)
			{
				App.localStorage.set('app_temapltes_'+templateName, data);
				that._cache[templateName] = data;
				that._templates[templateName] = new jSmart(data);
				that._loadingStates[templateName] = 'ready';

				if (typeof(callbackFunc) === 'function')
					callbackFunc(that._templates[templateName]);

				if (typeof(that._loadingCallbacks[templateName]) !== 'undefined')
				{
					for(var k in that._loadingCallbacks[templateName])
						that._loadingCallbacks[templateName][k](that._templates[templateName]);

					that._loadingCallbacks[templateName] = [];
				}
			}
		};

		var use_cache = true;
		if (!App.settings.enableTemplatesCache)
			use_cache = false;

		$.ajax({
			url: App.settings.templatePath + name,
			data: {},
			success: process,
			dataType: 'html',
			mimeType: 'text/plain',
			cache: use_cache
		});
	}


};