'use strict';

var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var assert = require('assert-plus');
var errors = require('../../node_modules/restify/lib/errors');

var CleanCSS = require('clean-css');

var items = require(__dirname + '/../../config/resources.json')['css']['files'];

function serveJS(opts) {
    opts = opts || {};
    assert.object(opts, 'options');

    var files = [];
    var __result = '';
    var __gzip = '';

    var initialized = false;

    function serve(req, res, next) {

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            next(new MethodNotAllowedError(req.method));
            return;
        }

        var callback = function(){
            doServe(req, res, next);
        };

        if (!initialized)
            init(callback);
        else
            callback();
    }

    function doServe(req, res, next)
    {
        if (req.acceptsEncoding('gzip'))
        {
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'text/css');
            res.writeHead(200);
            res.end(__gzip);
            console.log('Send css resources as gzip');
        } else {
            res.setHeader('Content-Type', 'text/css');
            res.writeHead(200);
            res.end(__result);
            console.log('Send css resources as plain');
        }

        next();
    }

    function addFile(filename) {
        files.push(filename);
    }

    function addFolder(pathname) {
        fs.readdirSync(pathname).forEach(function(file) {
            if (file.slice(-4) !== '.css') 
                return;
            addFile(path.join(pathname, file));
        });
    }

    function minify(callback) {
        console.log('Minify css files...');

        new CleanCSS().minify(files, function (error, minified) {
            __result = minified.styles;
            var buf = new Buffer(__result, 'utf-8');

            zlib.gzip(buf, function (_, res) {
                __gzip = res;
                console.log('Minify css files. Done.');
                if (typeof callback === 'function')
                    callback();
            });
        });

    }

    function init(callback)
    { 
        items.forEach(function(item){
            if (item.slice(-4) === '.css')
                addFile(item);
            else
                addFolder(item); 
        });

        minify(callback);
        
        initialized = true;   
    }
    return (serve);
}

module.exports = serveJS;
