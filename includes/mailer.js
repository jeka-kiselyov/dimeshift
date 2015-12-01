var nodemailer = require('nodemailer');
var rfr = require('rfr');
var env = process.env.NODE_ENV || 'development';
var config = rfr('config/config.json');
var fs = require('fs');

if (typeof(config[env]) == 'undefined')
	config = config['development'];
else
	config = config[env];

if (config.smtp.use_env_variables) {
	var transporter = nodemailer.createTransport({
		host: process.env[config.smtp.host],
		port: process.env[config.smtp.port],
		auth: {
			user: process.env[config.smtp.username],
			pass: process.env[config.smtp.password]
		}
	});
} else {
	var transporter = nodemailer.createTransport({
		host: config.smtp.host,
		port: config.smtp.port,
		auth: {
			user: config.smtp.username,
			pass: config.smtp.password
		}
	});
}

transporter.default_from_email = config.default_from_email;
transporter.default_replaces = {};
transporter.default_replaces.site_path = config.site_path;

var __mailtemplates_cache = {};

var sendMail = function(to, subject, html) {
	transporter.sendMail({
		from: transporter.default_from_email,
		to: to,
		subject: subject,
		html: html
	});
}

var sendTemplate = function(templateName, to, replaces) {
	var doSend = function() {
		var subject = __mailtemplates_cache[templateName].subject;
		var body = __mailtemplates_cache[templateName].body;

		for (var k in replaces) {
			subject = subject.split('%' + k + '%').join(replaces[k]);
			body = body.split('%' + k + '%').join(replaces[k]);
		}

		for (var k in transporter.default_replaces) {
			subject = subject.split('%' + k + '%').join(transporter.default_replaces[k]);
			body = body.split('%' + k + '%').join(transporter.default_replaces[k]);
		}

		sendMail(to, subject, body);
	};

	if (typeof(__mailtemplates_cache[templateName]) === 'undefined') {
		fs.readFile('./data/mailtemplates/' + templateName + '.template', function(err, data) {
			var lines = ("" + data).split("\n");
			var subject = lines.shift();
			var body = lines.join("\n");
			__mailtemplates_cache[templateName] = {
				subject: subject,
				body: body
			};

			doSend();
		});
	} else {
		doSend();
	}
}


exports.transporter = transporter;
exports.send = sendMail;
exports.sendTemplate = sendTemplate;