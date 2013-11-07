var through = require('through');

var level = require('level');
var sub = require('level-sublevel');
var db = sub(level(__dirname + '/latlon.db', { encoding: 'json' }));

module.exports = function (query, cb) {
    var parts = query.split(/[\.,\s\/]+/);
    var place = parts[0];
    
    var pending = 0, ended = false;
    var results = [];
    
    var qstream = db.createReadStream({
        start: place,
        end: place + '~',
        limit: 25
    });
    qstream.on('error', cb);
    qstream.pipe(through(write, end));
    
    function write (r) {
        ++ pending;
        db.get(r.key.split('!')[1], function (err, row) {
            row.from = r.key.split('!')[0];
            results.push(row);
            if (--pending === 0 && ended) done()
        })
    }

    function end () {
        ended = true;
        if (pending === 0) done();
    }

    function done () {
        var sorted = results.sort(function (a, b) {
            return a.population < b.population ? 1 : -1;
        });
        cb(null, sorted);
    }
};
