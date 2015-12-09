var fs = require('fs');
var rfr = require('rfr');
var path = require('path');

var routes = rfr('includes/routes');

var filesToWrite = {};

routes(function(routes) {
	routes.forEach(function(route) {

		var fileName = '' + route.route;
		fileName = fileName.replace(new RegExp("/:[^/]+/"), '/X/');
		fileName = fileName.replace(new RegExp("/:[^/]+$"), '/X');
		fileName = fileName.split('/').join('_');
		fileName = fileName.replace(new RegExp("^[_]+|[_]+$"), '');
		fileName = fileName + '.md';

		if (typeof(filesToWrite[fileName]) === 'undefined') {
			filesToWrite[fileName] = {};
			filesToWrite[fileName]['fileName'] = fileName;
			filesToWrite[fileName]['route'] = route.route;
			filesToWrite[fileName]['start'] = "## " + route.route + "\n";
		}

		var method = route.method;

		filesToWrite[fileName][method] = "";
		if (method == 'post')
			filesToWrite[fileName][method] += "### POST\n\n";
		if (method == 'get')
			filesToWrite[fileName][method] += "### GET\n\n";
		if (method == 'put')
			filesToWrite[fileName][method] += "### PUT\n\n";
		if (method == 'del')
			filesToWrite[fileName][method] += "### DELETE\n\n";

		var docs = route.docs || {
			description: '',
			params: {},
			returns: {
				description: '',
				sample: ''
			}
		};

		filesToWrite[fileName][method] += docs.description + "\n\n";
		filesToWrite[fileName][method] += "#### Parameters\n";

		var paramsMD = "";
		var paramsMDHeaders = {};
		var paramsMDRows = {};
		var hasParamsMD = false;

		paramsMDHeaders['Name'] = 0;
		paramsMDHeaders['Type'] = "Type".length;
		paramsMDHeaders['Description'] = "Description".length;
		paramsMDHeaders['Required'] = "Required".length;
		for (var k in docs.params) {
			hasParamsMD = true;
			var name = '' + k;
			var description = '' + docs.params[k].description;
			var type = ('' + docs.params[k].type) || 'string';
			var required = '';
			if (docs.params[k].required)
				required = 'yes';

			paramsMDRows[k] = {
				'Name': name,
				'Description': description,
				'Type': type,
				'Required': required
			};

			if (name.length > paramsMDHeaders['Name']) paramsMDHeaders['Name'] = name.length;
			if (description.length > paramsMDHeaders['Description']) paramsMDHeaders['Description'] = description.length;
			if (type.length > paramsMDHeaders['Type']) paramsMDHeaders['Type'] = type.length;
			if (required.length > paramsMDHeaders['Required']) paramsMDHeaders['Required'] = required.length;
		}

		var paramsMD = "| " + Array(paramsMDHeaders['Name'] + 1).join(' ') + " |";
		paramsMD += " Type" + Array(paramsMDHeaders['Type'] - "Type".length + 1).join(' ') + " |";
		paramsMD += " Description" + Array(paramsMDHeaders['Description'] - "Description".length + 1).join(' ') + " |";
		paramsMD += " Required" + Array(paramsMDHeaders['Required'] - "Required".length + 1).join(' ') + " |";

		paramsMD += "\n";
		paramsMD += "| " + Array(paramsMDHeaders['Name'] + 1).join('-') + " |";
		paramsMD += " " + Array(paramsMDHeaders['Type'] + 1).join('-') + " |";
		paramsMD += " " + Array(paramsMDHeaders['Description'] + 1).join('-') + " |";
		paramsMD += " " + Array(paramsMDHeaders['Required'] + 1).join('-') + " |";

		paramsMD += "\n";

		for (var k in paramsMDRows) {

			paramsMD += "| " + paramsMDRows[k].Name + Array(paramsMDHeaders['Name'] - paramsMDRows[k].Name.length + 1).join(' ') + " |";
			paramsMD += " " + paramsMDRows[k].Type + Array(paramsMDHeaders['Type'] - paramsMDRows[k].Type.length + 1).join(' ') + " |";
			paramsMD += " " + paramsMDRows[k].Description + Array(paramsMDHeaders['Description'] - paramsMDRows[k].Description.length + 1).join(' ') + " |";
			paramsMD += " " + paramsMDRows[k].Required + Array(paramsMDHeaders['Required'] - paramsMDRows[k].Required.length + 1).join(' ') + " |";

			paramsMD += "\n";
		}

		if (hasParamsMD)
			filesToWrite[fileName][method] += paramsMD + "\n";

		var sampleJSON = null;
		try {
			sampleJSON = JSON.parse(docs.returns.sample);
		} catch (e) {
			sampleJSON = null;
		}

		if (docs.returns.description != '' || sampleJSON !== null) {
			filesToWrite[fileName][method] += "#### Response\n";
			filesToWrite[fileName][method] += "##### On success\n\n";


			if (docs.returns.description != '')
				filesToWrite[fileName][method] += docs.returns.description + "\n\n";

			if (sampleJSON !== null) {
				filesToWrite[fileName][method] += "**Sample response**\n\n";
				filesToWrite[fileName][method] += "```json\n";
				filesToWrite[fileName][method] += JSON.stringify(sampleJSON, null, 2)
				filesToWrite[fileName][method] += "\n```\n";
			}
		}

	});

	var readme = "## API documentation\n\n";

	for (var k in filesToWrite) {
		var fileToWrite = filesToWrite[k];
		var fileName = path.join(__dirname, '..', 'docs/api', fileToWrite['fileName']);
		var content = fileToWrite['start'];
		if (typeof(fileToWrite['get']) !== 'undefined')
			content += fileToWrite['get'];
		if (typeof(fileToWrite['post']) !== 'undefined')
			content += fileToWrite['post'];
		if (typeof(fileToWrite['put']) !== 'undefined')
			content += fileToWrite['put'];
		if (typeof(fileToWrite['del']) !== 'undefined')
			content += fileToWrite['del'];

		console.log("Writing " + fileName);

		fs.writeFileSync(fileName, content);

		console.log("Done");
		readme += "[" + fileToWrite.route + "](" + fileToWrite['fileName'] + ")\n\n";
	};

	console.log("Writing readme.md");

	var readmeFileName = path.join(__dirname, '..', 'docs/api', 'readme.md');
	fs.writeFileSync(readmeFileName, readme);

	console.log("Done");
});