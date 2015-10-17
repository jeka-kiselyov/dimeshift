var fs = require('fs');
var servers = {};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == "index.js") return;
  var name = file.substr(0, file.indexOf('.'));
  servers[name] = require('./' + name);
});

module.exports = servers;