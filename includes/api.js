var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');
var fs = require('fs');
var path = require('path');

exports.requireSignedIn = function (req, callback) 
{
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	var ip = req.connection.remoteAddress || null;

	if (auth_code == '')
		throw new errors.HaveNoRightsError();
	
	db.User.getByAuthCode({auth_code: auth_code, ip: ip}).then(function(user){
		if (typeof(callback) == 'function')
			callback(user);
	}, function(err){
		throw new errors.HaveNoRightsError();
	});
}

var i18n_path = path.join(__dirname, '../data/i18n');
var i18n_cache = {};
exports.geti18njson = function(code) 
{
	if (typeof(i18n_cache[code]) !== 'undefined')
		return i18n_cache[code];

	i18n_cache[code] = fs.readFileSync(path.join(i18n_path, code+'.json'), 'utf8');
	return i18n_cache[code];
}