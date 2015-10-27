var rfr       = require('rfr');
var env       = process.env.NODE_ENV || 'development';
var config    = rfr('config/config.json');

if (typeof(config[env]) == 'undefined')
  config = config['development'];
else
  config = config[env];

config['env'] = env;
config['resources'] = rfr('config/resources.json');

module.exports = config;
