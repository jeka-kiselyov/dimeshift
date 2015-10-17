var fs = require('fs');
var routes = [];

var done = false;
var callback;

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk(__dirname, function(err, results) {
  if (err) throw err;
  results.forEach(function(file){
  	if (file.indexOf('index.js') == -1)
  	{
  		var name = file.substr(file.lastIndexOf('/'), file.indexOf('.'));
  		var inc = require(file);
  		routes.push({ handler: inc.handler, route: inc.route, method: inc.method });
  	}
  });

  done = true;
  if(typeof callback == 'function')
      callback(routes);
});

module.exports = function(cb){
    if(done)
      cb(routes);
    else
      callback = cb;
}