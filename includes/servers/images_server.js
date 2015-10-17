'use strict';

var fs = require('fs');
var path = require('path');
var escapeRE = require('escape-regexp-component');

var assert = require('assert-plus');
var mime = require('mime');
var errors = require('../../node_modules/restify/lib/errors');

var MethodNotAllowedError = errors.MethodNotAllowedError;
var NotAuthorizedError = errors.NotAuthorizedError;
var ResourceNotFoundError = errors.ResourceNotFoundError;

function serveImage(opts) {

    var __cache = {};

    function serveFileFromStats(file, err, stats, isGzip, req, res, next) {
        if (err ||!stats.isFile() ) {
            res.writeHead( 404, "Not Found" );
            res.end();
            return next(false);
        }

        var vsize = stats.size;
        var vmime = mime.lookup(file);
        var vmtime = stats.mtime;

        __cache[file] = {size: vsize, mime: vmime, mtime: vmtime};

        res.setHeader("Cache-Control", "public, max-age=2592000");
        res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());

        res.set('Content-Length', __cache[file]['size']);
        res.set('Content-Type', __cache[file]['mime']);
        res.setHeader('Content-Type', __cache[file]['mime']);
        res.set('Last-Modified', __cache[file]['mtime']);

        res.writeHead(200);
        fs.readFile(file, function (err, data) {
             __cache[file]['content'] = data;
             res.end(data);
             return next(false);
        });
    }

    function serveNormal(file, req, res, next) {
        if (typeof(__cache[file]) !== 'undefined') {
            
            res.setHeader("Cache-Control", "public, max-age=2592000");
            res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());

            res.set('Content-Length', __cache[file]['size']);
            res.set('Content-Type', __cache[file]['mime']);
            res.setHeader('Content-Type', __cache[file]['mime']);
            res.set('Last-Modified', __cache[file]['mtime']);

            res.writeHead(200);
            res.end(__cache[file]['content']);

            next(false);
        } else {
            fs.stat(file, function (err, stats) {
                serveFileFromStats(file,
                    err,
                    stats,
                    false,
                    req,
                    res,
                    next);
            });
        }
    }

    function serve(req, res, next) {
        if (req.headers[ "if-modified-since" ]) {
            res.writeHead( 304, "Not Modified" );
            res.end();
            return next(false);
        }
        var file;

        file = decodeURIComponent(req.path()).split('images/').join('');
        file = path.join('./public/images/', file);

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead( 404, "Not Found" );
            res.end();
            return next(false);
        }

        serveNormal(file, req, res, next);
    }

    return (serve);
}

module.exports = serveImage;