// import_xls.js
App.Views.Pages.ImportXLS = App.Views.Abstract.Page.extend({

	templateName: 'pages/import/xls',
	additionalScripts: [
		'/vendors/js-xlsx/dist/xlsx.min.js',
		'/vendors/moment/min/moment.min.js'
	],
    category: 'wallets',
	events: {
		'change #file_input': 'fileInputChanged',
		'change .import_row_type': 'checkRowsToImport',
		'click .select_file_button': 'selectFile',
		'click #proccess_step1_button': 'goToPreview',
		'click #proccess_step2_cancel': 'goToFirstStep',
		'click #proccess_step2_button': 'goToImport'
	},
	worksheet: null,
	sample: null,
	sampleWidth: null,
	sampleHeight: null,
	importPreview: null,
	step: 1,
	selectedFields: {
		date: false,
		time: false,
		description: false,
		amount: false,
		abs_amount: false
	},
	selectedTimeFormat: false,
	selectedDateFormat: false,
	dateFormats: [
		'DD.MM.YYYY',
		'MM.DD.YYYY',
		'DD-MM-YYYY',
		'MM-DD-YYYY',
		'YYYY-MM-DD',
		'YYYY-DD-MM',
		'YYYY.MM.DD',
		'YYYY.DD.MM'
	],
	timeFormats: [
		'H:m',
		'h:m a'
	],
	title: function() {
		return 'Import';
	},
	selectFile: function() {
		this.$('#file_input').click();
	},
	goToFirstStep: function() {
		this.step = 1;
		this.render();
	},
	goToPreview: function() {
		this.step = 2;
		this.render();
	},
	goToImport: function() {
		this.step = 3;
		this.render();
		this.import();
	},
	render: function() {
		this.renderHTML({sample: this.sample, sampleHeight: this.sampleHeight, sampleWidth: this.sampleWidth,
			dateFormats: this.dateFormats, timeFormats: this.timeFormats, importPreview: this.importPreview, 
			step: this.step, selectedFields: this.selectedFields, wallet_id: this.model.id});
	},
	wakeUp: function() {
		this.holderReady = false;
		this.render();
	},
	alreadyImportedRowN: 0,
	alreadyGotDataRowN: 0,
	rowToImportCount: 0,
	minImportedRowDate: null,
	maxImportedRowDate: null,
	rowsToImport: [],
	import: function() {
		this.alreadyImportedRowN = 0;
		this.rowsToImport = [];
		this.alreadyGotDataRowN = 0;
		this.rowToImportCount = this.worksheet['!range'].e.r;
		var that = this;
		setTimeout(function(){
			that.getNextRowData();
		}, 100);
	},
	getNextRowData: function() {
		var that = this;

		this.alreadyGotDataRowN++;

		var date = null;
		var description = null;
		var amount = null;

		/// date
		var date_format = this.selectedDateFormat;
		var time_format = this.selectedTimeFormat;
		if (this.selectedFields.date){
			var txt_date = that.getValueForCell(this.selectedFields.date, this.alreadyGotDataRowN);
			if (this.selectedFields.time && this.selectedFields.time != this.selectedFields.date)
				txt_date+=' '+that.getValueForCell(this.selectedFields.time, this.alreadyGotDataRowN);
			date_format+=' '+time_format;

			var parsed = moment(txt_date, date_format);

			if (parsed.isValid()){
				date = parsed.unix();
				if (!this.minImportedRowDate || date < this.minImportedRowDate)
					this.minImportedRowDate = date;
				if (!this.maxImportedRowDate || date < this.maxImportedRowDate)
					this.maxImportedRowDate = date;
			}
		}

		/// description
		if (this.selectedFields.description){
			var value = that.getValueForCell(this.selectedFields.description, this.alreadyGotDataRowN);
			value = value.replace(/<\/?[^>]+(>|$)/g, "");
			value = value.substring(0,250);
			if (value)
				description = value;
		}

		/// amount
		if (this.selectedFields.amount) {
			var value = that.getValueForCell(this.selectedFields.amount, this.alreadyGotDataRowN);
			value = parseFloat(value, 10);
			if (!isNaN(value))
				amount = value;
		}
		if (this.selectedFields.abs_amount) {
			var value = that.getValueForCell(this.selectedFields.amount, this.alreadyGotDataRowN);
			value = Math.abs(parseFloat(value, 10));
			if (!isNaN(value))
				amount = -value;
		}

		if (amount !== null && date !== null)
			this.rowsToImport.push({amount: amount, datetime: date, description: description});

		var progress = Math.floor((this.alreadyGotDataRowN / this.rowToImportCount) * 100 / 2);
		this.$('#import_progress_bar').css('width', progress+'%');

		if (this.alreadyGotDataRowN < this.rowToImportCount)
		{
			setTimeout(function(){
				that.getNextRowData();
			}, 100);
		} else {
			this.rowToImportCount = this.rowsToImport.length;
			setTimeout(function(){
				that.getTransactionsToCheckForDuplicates();
			}, 100);
		}
	},
	trasactionsToCheckForDuplicates: [],
	getTransactionsToCheckForDuplicates: function() {
		var that = this;
		this.trasactionsToCheckForDuplicates = [];
		var minDate = new Date(this.minImportedRowDate*1000);
		var maxDate = new Date(this.maxImportedRowDate*1000);
		var minMonth = minDate.getMonth() + 1;
		var minYear = minDate.getFullYear();
		var maxMonth = maxDate.getMonth() + 1;
		var maxYear = maxDate.getFullYear();

		var curMonth = minMonth;
		var curYear = minYear;
		do {
			var transactions = new App.Collections.Transactions();
			transactions.setPeriod(curMonth, curYear);
            transactions.setWalletId(this.model.id);

            this.trasactionsToCheckForDuplicates.push(transactions);
            if (curMonth == 12)
            {
            	curMonth = 1;
            	curYear++;
            } else {
            	curMonth ++;
            }
		} while ((curMonth <= maxMonth && curYear == maxYear) || curYear < maxYear);

		var promises = [];
		for (var k in this.trasactionsToCheckForDuplicates)
			promises.push(this.trasactionsToCheckForDuplicates[k].fetch());

		$.when.apply($, promises).done(function(){
			that.importNextRow();
		});
	},
	checkIfNoDuplicates: function(row) {
		for (var k in this.trasactionsToCheckForDuplicates)
			for (var i = 0; i < this.trasactionsToCheckForDuplicates[k].length; i++)
			{
				var transaction = this.trasactionsToCheckForDuplicates[k].models[i];
				if (transaction.get('amount') == row.amount && 
					transaction.get('datetime') == row.datetime && 
					transaction.get('description') == row.description)
					return false;
			};

			return true;
	},
	importNextRow: function() {
		var that = this;

		this.alreadyImportedRowN++;

		var row = this.rowsToImport[this.alreadyImportedRowN];
		var onNext = function() {

			var progress = 50 + Math.floor((that.alreadyImportedRowN / that.rowToImportCount) * 100 / 2);
			that.$('#import_progress_bar').css('width', progress+'%');

			if (that.alreadyImportedRowN < that.rowToImportCount)
			{
				setTimeout(function(){
					that.importNextRow();
				}, 100);
			} else {
				that.step = 4;
				that.render();
			}
		}

		if (row && this.checkIfNoDuplicates(row))
		{
			var transaction = new App.Models.Transaction();
			transaction.set('amount', row.amount);
			transaction.set('description', row.description);
			transaction.set('datetime', row.datetime);
	        transaction.set('wallet_id', this.model.id);

			transaction.save().then(function(){
				onNext();
			});
		} else {
			onNext();
		}

	},
	checkRowsToImport: function() {
		var x = 1;
		var y = 1;
		var height = this.worksheet['!range'].e.r;
		var badToImport = [];
		var that = this;

		var date_column_x = false;
		var time_column_x = false;

		var has_date = false;
		var has_amount = false;

		var importPreview = {};


		$('.import_row_date_format').hide();
		$('.import_row_time_format').hide();

		$('.import_row_type').each(function(){
			var type = $(this).val();

			if (type == 'date')
				$('#import_row_'+x+'_date_format').show();

			if (type == 'time')
				$('#import_row_'+x+'_time_format').show();

			for (y = 1; y < height; y++)
			{
				var value = that.getValueForCell(x, y);
				if (type == 'amount')
				{
					if (isNaN(parseFloat(value))) badToImport.push(y);
					else {
						if (typeof(importPreview[y]) == 'undefined') importPreview[y] = {};
						importPreview[y]['amount'] = value;
						has_amount = true;

						that.selectedFields.amount = x;	
					}
				}
				else if (type == 'abs_amount')
				{
					if (isNaN(parseFloat(value)) || value < 0) badToImport.push(y);
					else {
						if (typeof(importPreview[y]) == 'undefined') importPreview[y] = {};
						importPreview[y]['amount'] = -parseFloat(value);
						has_amount = true;			

						that.selectedFields.abs_amount = x;		
					}
				}
				else if (type == 'description')
				{
					if (typeof(importPreview[y]) == 'undefined') importPreview[y] = {};
					importPreview[y]['description'] = value;
					that.selectedFields.description = x;
				}
				else if (type == 'date')
				{
					date_column_x = x;
					that.selectedFields.date = x;
					that.selectedDateFormat = that.$('#import_row_'+x+'_date_format').val();
				}
				else if (type == 'time')
				{
					time_column_x = x;
					that.selectedFields.time = x;
					that.selectedTimeFormat = that.$('#import_row_'+x+'_time_format').val();
				}
				else if (type == 'datetime')
				{
					date_column_x = x;
					time_column_x = x;
					that.selectedFields.datetime = x;
					that.selectedDateFormat = that.$('#import_row_'+x+'_date_format').val();
					that.selectedTimeFormat = that.$('#import_row_'+x+'_time_format').val();
				}
			}
			x++;
		});

		var date_format = this.selectedDateFormat;
		var time_format = this.selectedTimeFormat;
		if (date_column_x)
		for (y = 1; y < height; y++)
		{
			var date = that.getValueForCell(date_column_x, y);
			if (time_column_x && time_column_x != date_column_x){
				date+=' '+that.getValueForCell(time_column_x, y);
				date_format+=' '+time_format;
			}

			var parsed = moment(date, date_format);

			if (!parsed.isValid())
				badToImport.push(y);
			else {
				if (typeof(importPreview[y]) == 'undefined') importPreview[y] = {};
				importPreview[y]['date'] = parsed.unix();
				has_date = true;
			}
		}

		this.importPreview = null;
		for (var k in importPreview)
		{
			if (typeof(importPreview[k]['date']) != 'undefined' && typeof(importPreview[k]['amount']) != 'undefined')
			if (!this.importPreview || this.importPreview.length < 10)
			{
				if (!this.importPreview) 
					this.importPreview = [];
				this.importPreview.push(importPreview[k]);
			}
		}

		$('.sample_import_row').addClass('info');
		badToImport.forEach(function(y){
			$('#sample_import_row_'+y).removeClass('info');
		});

		if (has_date && has_amount)
		{
			this.$('#proccess_step1_warning').hide();
			this.$('#proccess_step1_button').prop('disabled', false);
		} else {
			this.$('#proccess_step1_warning').show();	
			this.$('#proccess_step1_button').prop('disabled', 'disabled');		
		}
	},
	getValueForCell: function(x, y)
	{
		var cell = this.worksheet[String.fromCharCode(64+x)+y];
		if (typeof(cell) == 'undefined')
			return '';
		else
			return cell.v;
	},
	newData: function(workbook) {
		var first_sheet_name = workbook.SheetNames[0];
		this.worksheet = workbook.Sheets[first_sheet_name];

		var width = this.worksheet['!range'].e.c;
		var height = this.worksheet['!range'].e.r;
		var skip_line_from = 3;
		var skip_line_to = height - 4;
		var skiped_count = height - 6;

		var sample = [];
		for (var y = 1; y < height; y++){
			if (height > 6 && y > skip_line_from && y < skip_line_to)
			{
				y = skip_line_to;
				sample.push({skiped: skiped_count});
			} else {
				var line = [];
				for (var x = 1; x <= width; x++){
					var value = this.getValueForCell(x, y);
					line.push(value);
				}
				sample.push({items: line, y: y});
			}
		}

		this.sample = sample;

		this.sampleWidth = width;
		this.sampleHeight = height;
		this.render();
	},
	fileInputChanged: function(e) {
		this.$('.select_file_button').button('loading');
		if (typeof(e.target.files) !== 'undefined' && e.target.files.length > 0)
			this.fileChanged(e.target.files[0]);
	},
	fileChanged: function(file) {
		var reader = new FileReader();
		var that = this;

		that.$('.alert', '#step_1').hide();
		reader.onload = function(e)
		{
			var data = e.target.result;
			var workbook = null;
			try {
				workbook = XLSX.read(data, {type: 'binary'});
			} catch (e) {
				that.$('.alert', '#step_1').show();
			}

			if (workbook)
				that.newData(workbook);

			that.$('.select_file_button').button('reset');
		}
		reader.readAsBinaryString(file);
	},
	initialize: function(params) {
		this.renderLoading();
		var that = this;
		App.helper.loadAdditionalScripts(this.additionalScripts, function(){

			if (typeof(params.wallet_id) !== 'undefined')
			{
				that.model = new App.Models.Wallet();
				that.model.id = params.wallet_id;

				that.model.fetch({
					success: function() {
						that.render();
					},
					error: function(){
						App.showPage('NotFound');
					}
				});	
			} else 
				throw 'wallet_id parameter required';

		});
	}

});