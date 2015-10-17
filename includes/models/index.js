'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');;
var rfr       = require('rfr');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = rfr('config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.db = db;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//// Foreign keys
db['Authentication'].belongsTo(db['User'], {foreignKey: 'user_id', constraints: false}); 
db['User'].hasMany(db['Authentication'], {foreignKey: 'user_id', constraints: false}); 

db['Wallet'].belongsTo(db['User'], {foreignKey: 'user_id', constraints: false});  
db['User'].hasMany(db['Wallet'], {foreignKey: 'user_id', constraints: false}); 

db['Transaction'].belongsTo(db['User'], {foreignKey: 'user_id', constraints: false});
db['Transaction'].belongsTo(db['Wallet'], {foreignKey: 'wallet_id', constraints: false});
  
db['User'].hasMany(db['Transaction'], {foreignKey: 'user_id', constraints: false}); 
db['Wallet'].hasMany(db['Transaction'], {foreignKey: 'wallet_id', constraints: false});  


module.exports = db;
