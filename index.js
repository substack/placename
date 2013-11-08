var through = require('through');
var countries = require('countrynames');
var quotemeta = require('quotemeta');

var level = require('level');
var sub = require('level-sublevel');
var db = sub(level(__dirname + '/latlon.db', { encoding: 'json' }));

module.exports = function (query, cb) {
    var parts = query.toLowerCase().split(/[\.,\s\/]+/);
    
    (function next (index) {
        if (index === 0) return cb(null, [])
        
        var terms = parts.slice(0, index).join(' ');
        find(terms, function (err, res) {
            if (err) return cb(err);
            if (res.length === 0) return next(index - 1);
            
            var extras = parts.slice(index).join(' ').split(RegExp(
                '(' + countries.getAllNames().map(quotemeta).join('|') + ')'
                    + '|\\s',
                'i'
            )).filter(Boolean);
            var matching = res.filter(function (row) {
                return extras.every(function (e) {
                    var ue = e.toUpperCase();
                    return row.country === ue
                        || row.adminCode === ue
                        || row.altCountry.toUpperCase() === ue
                        || countries.getCode(e) === row.country
                    ;
                });
            });
            
            if (matching.length) cb(null, matching)
            else next(index - 1)
        });
    })(parts.length);
};
    
function find (query, cb) {
    var pending = 0, ended = false;
    var results = {};
    
    var qstream = db.createReadStream({
        start: query,
        end: query + '~',
        limit: 25
    });
    qstream.on('error', cb);
    qstream.pipe(through(write, end));
    
    function write (r) {
        ++ pending;
        var key = r.key.split('!')[1];
        db.get(key, function (err, row) {
            row.from = r.key.split('!')[0];
            results[key] = row;
            if (--pending === 0 && ended) done()
        })
    }
    
    function end () {
        ended = true;
        if (pending === 0) done();
    }
    
    function done () {
        var rows = Object.keys(results).map(function (key) {
            return results[key]
        });
        var sorted = rows.sort(function (a, b) {
            return a.population < b.population ? 1 : -1;
        });
        cb(null, sorted);
    }
}
