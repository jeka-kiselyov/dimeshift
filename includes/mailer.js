var nodemailer = require('nodemailer');
var rfr = require('rfr');
var fs = require('fs');

var config = rfr('includes/config.js');

var transporter = null;
if (config && config.smtp) {
	if (config.smtp.use_env_variables) {
		transporter = nodemailer.createTransport({
			host: process.env[config.smtp.host],
			port: process.env[config.smtp.port],
			auth: {
				user: process.env[config.smtp.username],
				pass: process.env[config.smtp.password]
			}
		});
	} else {
		transporter = nodemailer.createTransport({
			host: config.smtp.host,
			port: config.smtp.port,
			auth: {
				user: config.smtp.username,
				pass: config.smtp.password
			}
		});
	}

	if (config.default_from_email)
		transporter.default_from_email = config.default_from_email;
}

var default_replaces = {};
if (config.site_path)
	default_replaces.site_path = config.site_path;

var __mailtemplates_cache = {};

var sendMail = function(to, subject, html) {
	if (transporter !== null)
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

		for (var k in default_replaces) {
			subject = subject.split('%' + k + '%').join(default_replaces[k]);
			body = body.split('%' + k + '%').join(default_replaces[k]);
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