var rfr = require('rfr');
var db = rfr('includes/models');
var errors = rfr('includes/errors.js');

exports.requireSignedIn = function (req, callback) 
{
	var cookies = req.cookies;
	var auth_code = cookies.logged_in_user || '';

	if (auth_code == '')
		throw new errors.HaveNoRightsError();
	
	db.User.getByAuthCode(auth_code).then(function(user){
		if (typeof(callback) == 'function')
			callback(user);
	}, function(err){
		throw new errors.HaveNoRightsError();
	});
}
