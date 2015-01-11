var http = require('http');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var ecstatic = require('ecstatic');
var st = ecstatic(__dirname + '/static');

var datadir = path.join(__dirname, 'data');
mkdirp.sync(datadir);

var server = http.createServer(function (req, res) {
    if (req.url.split('/')[1] === 'save') {
        var name = req.url.split('/')[2];
        if (/\.\./.test(name)) {
            res.statusCode = 405;
            return res.end('invalid filename');
        }
        var w = fs.createWriteStream(path.join(datadir, name));
        w.on('error', function (err) {
            res.end(err + '\n');
        });
        w.on('finish', function () {
            res.end('ok\n');
        });
        req.pipe(w);
    }
    else st(req, res);
});
server.listen(5000);
