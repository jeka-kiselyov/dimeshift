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
		'click .select_file_button': 'selectFile'
	},
	worksheet: null,
	sample: null,
	sampleWidth: null,
	sampleHeight: null,
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
		return 'Import XLS';
	},
	selectFile: function() {
		this.$('#file_input').click();
	},
	render: function() {
		console.log(3);
		this.renderHTML({sample: this.sample, sampleHeight: this.sampleHeight, sampleWidth: this.sampleWidth,
			dateFormats: this.dateFormats, timeFormats: this.timeFormats});
		console.log(3);
	},
	wakeUp: function() {
		this.holderReady = false;
		this.render();
	},
	checkRowsToImport: function() {
		var x = 1;
		var y = 1;
		var height = this.worksheet['!range'].e.r;
		var badToImport = [];
		var that = this;

		var date_column_x = false;
		var time_column_x = false;

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
				}
				else if (type == 'abs_amount')
				{
					if (isNaN(parseFloat(value)) || value < 0) badToImport.push(y);					
				}
				else if (type == 'date')
				{
					date_column_x = x;
				}
				else if (type == 'time')
				{
					time_column_x = x;
				}
				else if (type == 'datetime')
				{
					date_column_x = x;
					time_column_x = x;
				}
			}
			x++;
		});

		var date_format = 'DD.MM.YYYY';
		var time_format = 'H:m';
		if (date_column_x)
		for (y = 1; y < height; y++)
		{
			var date = that.getValueForCell(date_column_x, y);
			if (time_column_x && time_column_x != date_column_x){
				date+=' '+that.getValueForCell(time_column_x, y);
				date_format+=' '+time_format;
			}

			var parsed = moment(date, date_format);
			console.log('Date: '+date+'  parsed as: '+parsed.format());

			if (!parsed.isValid())
				badToImport.push(y);
		}


		console.log(badToImport);
		$('.sample_import_row').addClass('info');
		badToImport.forEach(function(y){
			$('#sample_import_row_'+y).removeClass('info');
		});
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

		console.log(sample);
		this.sample = sample;

		this.sampleWidth = width;
		this.sampleHeight = height;
		this.render();

		console.log(width);
		console.log(height);
		console.log(sample);
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
	initialize: function() {
		this.renderLoading();
		var that = this;
		App.helper.loadAdditionalScripts(this.additionalScripts, function(){

			that.on('render', function(){


			});

			that.render();
		});
	}

});