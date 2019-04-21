'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var escapeRE = require('escape-regexp-component');

function serveStatic(opts) {
    opts = opts || {};

    var p = path.normalize(opts.directory).replace(/\\/g, '/');
    var re = new RegExp('^' + escapeRE(p) + '/?.*');

    function serveFileFromStats(file, err, stats, isGzip, req, res, next) {
        if (err) {
            res.writeHead(404, "Not Found");
            next();
            return;
        } else if (!stats.isFile()) {
            res.writeHead(404, "Not Found");
            next()
            return;
        }

        if (res.handledGzip && isGzip) {
            res.handledGzip();
        }

        var fstream = fs.createReadStream(file + (isGzip ? '.gz' : ''));
        var maxAge = opts.maxAge === undefined ? 3600 : opts.maxAge;
        fstream.once('open', function(fd) {
            res.cache({
                maxAge: maxAge
            });
            res.set('Content-Length', stats.size);

            var mimeType = mime.getType(file);
            if (mimeType == 'application/vnd.groove-tool-template')
                mimeType = 'text/html';

            res.set('Content-Type', mimeType);
            res.set('Last-Modified', stats.mtime);
            res.setHeader('Access-Control-Allow-Origin', '*');

            if (opts.charSet) {
                var type = res.getHeader('Content-Type') +
                    '; charset=' + opts.charSet;
                res.setHeader('Content-Type', type);
            }

            if (opts.etag) {
                res.set('ETag', opts.etag(stats, opts));
            }
            res.writeHead(200);
            fstream.pipe(res);
            fstream.once('end', function() {
                next(false);
            });
        });
    }

    function serveNormal(file, req, res, next) {
        fs.stat(file, function(err, stats) {
            if (!err && stats.isDirectory() && opts.default) {
                // Serve an index.html page or similar
                file = path.join(file, opts.default);
                fs.stat(file, function(dirErr, dirStats) {
                    serveFileFromStats(file,
                        dirErr,
                        dirStats,
                        false,
                        req,
                        res,
                        next);
                });
            } else {
                serveFileFromStats(file,
                    err,
                    stats,
                    false,
                    req,
                    res,
                    next);
            }
        });
    }

    function serve(req, res, next) {
        var file;

        if (opts.file) {
            //serves a direct file
            file = path.join(opts.directory,
                decodeURIComponent(opts.file));
        } else {
            file = path.join(opts.directory,
                decodeURIComponent(req.path()));
        }

        if (opts.suffix)
            file += opts.suffix;

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(404, "Not Found");
            next();
            return;
        }

        if (!re.test(file.replace(/\\/g, '/'))) {
            res.writeHead(404, "Not Found");
            next();
            return;
        }

        if (opts.match && !opts.match.test(file)) {
            res.writeHead(404, "Not Found");
            next();
            return;
        }

        if (opts.gzip && req.acceptsEncoding('gzip')) {
            fs.stat(file + '.gz', function(err, stats) {
                if (!err) {
                    res.setHeader('Content-Encoding', 'gzip');
                    serveFileFromStats(file,
                        err,
                        stats,
                        true,
                        req,
                        res,
                        next);
                } else {
                    serveNormal(file, req, res, next);
                }
            });
        } else {
            serveNormal(file, req, res, next);
        }

    }

    return (serve);
}

module.exports = serveStatic;