var fs = require('fs');
var path = require('path');

var harvester = function(dirname, callback) {

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

  var foundItems = {};
  var foundItemsCount = 0;

  var parseFile = function(filename, transalateTag)
  {
    var transalateTag = transalateTag || 't';
    var regex = new RegExp("\{"+transalateTag+"\}([^\{]+)\{\/"+transalateTag+"\}", 'g');
    var data = ""+fs.readFileSync(filename, 'utf8');
    var matches = data.match(regex);

    var openingTagLength = ('{'+transalateTag+'}').length;
    var closingTag = '{/'+transalateTag+'}';
    var closingTagLength = closingTag.length;

    if (matches != null)
    matches.forEach(function(match){
      var string = '';
      if (match.length > 7)
        string = match.substr(openingTagLength, match.indexOf(closingTag)-openingTagLength);
      else
        return false;

      if (typeof(foundItems[string]) == 'undefined')
      {
        foundItems[string] = '';
        foundItemsCount++;
      }
    });
  }

  var parseHTMLFile = function(filename)
  {
    var regex = /data-i18n="([^"]+)"/g;
    var data = ""+fs.readFileSync(filename, 'utf8');
    var matches = data.match(regex);

    if (matches != null)
    matches.forEach(function(match){
      var string = '';
      if (match.length > 7)
        string = match.substr(("data-i18n=\"").length, match.length-("data-i18n=\"").length-1);
      else
        return false;

      if (typeof(foundItems[string]) == 'undefined')
      {
        foundItems[string] = '';
        foundItemsCount++;
      }
    });
  }

  walk(dirname, function(err, results){

    console.log('Found '+results.length+' files');
    if (err) throw err;

    var foundTplCount = 0;
    var foundHtmlCount = 0;
    results.forEach(function(file) {
      if (file.slice(-4) === '.tpl')
      {
        parseFile(file);
        parseFile(file, 'ts');
        parseFile(file, 'tp');
        foundTplCount++;
      }
      if (file.slice(-5) === '.html' || file.slice(-4) === '.htm'){
        parseHTMLFile(file);
        foundHtmlCount++;
      }
    });

    console.log('Found '+foundTplCount+' tpl files');
    console.log('Found '+foundHtmlCount+' html files');
    console.log('Found '+foundItemsCount+' i18n strings');

    callback(Object.keys(foundItems));
  });

}

var dirname = path.join(__dirname, '..', 'public');
var i18n_dirname = path.join(__dirname, '..', 'data/i18n');
harvester(dirname, function(strings){
// console.log(strings);
  var i18n_files = fs.readdirSync(i18n_dirname);
  i18n_files.filter(function(file){
    if (file.slice(-5) !== '.json')
      return false;
    else
      return true;
  });

  var updatei18n = function(i18n_file, strings)
  {
    var data = {};
    try {
      data = JSON.parse(""+fs.readFileSync(path.join(i18n_dirname, i18n_file), 'utf8'));
    } catch(e) {

    }

    var newStringsCount = 0;

    strings.forEach(function(string){
      if (typeof(data[string]) == 'undefined'){
        data[string] = '';
        newStringsCount++;
      }
    });

    fs.writeFileSync(path.join(i18n_dirname, i18n_file), JSON.stringify(data, null, 2));

    console.log('Updated. Added '+newStringsCount+' new strings.');
  }

  console.log("There're "+i18n_files.length+' i18n files');
  // console.log(i18n_files);
  // console.log(strings);

  i18n_files.forEach(function(i18n_file){
    console.log('Updating '+i18n_file);
    updatei18n(i18n_file, strings);
  });

  console.log('Done');

});
