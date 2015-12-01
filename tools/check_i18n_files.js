var fs = require('fs');
var path = require('path');

var i18n_dirname = path.join(__dirname, '..', 'data/i18n');

fs.readdir(i18n_dirname, function(err, list) {
	list.forEach(function(filename) {

		console.log('\x1b[36m', 'i18n file:', '\x1b[0m', filename);

		var content = null;
		try {
			content = "" + fs.readFileSync(path.join(i18n_dirname, filename), 'utf8');
		} catch (e) {
			console.log('\x1b[31m', 'Error:', '\x1b[0m', 'Can not open file. Permission denied');
		}

		if (content !== null) {
			try {
				var items = JSON.parse(content);

				var items_count = 0;
				for (var k in items) {
					if (items.hasOwnProperty(k)) {
						items_count++;
					}
				}

				var strings_count = 'no strings';

				if (items_count == 1)
					strings_count = '1 string';
				else if (items_count > 1)
					strings_count = items_count + ' strings';

				console.log('\x1b[36m', 'Valid:', '\x1b[0m', strings_count);

			} catch (e) {

				console.log('\x1b[31m', 'Error:', '\x1b[0m', 'Invalid JSON format');
				console.log('NOT VALID');
			}
		}
	});
});