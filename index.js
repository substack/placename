var through = require('through');
var countries = require('countrynames');
var quotemeta = require('quotemeta');
var provinces = require('provinces');

var level = require('level');
var db = level(__dirname + '/data', { encoding: 'json' });

var places = countries.getAllNames()
    .concat(provinces.reduce(function (acc, r) {
        return acc.concat(r.name || [], r.short || [], r.alt || [])
    }, []))
;
var provinceMap = provinces.reduce(function (acc, p) {
    if (!acc[p.country]) acc[p.country] = {};
    [ p.name, p.short ].concat(p.alt).filter(Boolean).forEach(function (k) {
        acc[p.country][k] = true;
    });
    return acc;
}, {});

var allProvinces = provinces.reduce(function (acc, p) {
    [ p.name, p.short ].concat(p.alt).filter(Boolean).forEach(function (k) {
        k = k.toUpperCase();
        var sk = p.short && p.short.toUpperCase();
        if (!acc[k]) acc[k] = [];
        if (sk && !acc[sk]) acc[sk] = [];
        if (sk) acc[sk].push(p);
        acc[k].push(p);
    });
    return acc;
}, {});

var special = {
    uk: 'gb',
    usa: 'us'
};

module.exports = function (query, cb) {
    var parts = query.toLowerCase().split(/[\.,\s\/]+/)
        .map(function (p) { return special[p] || p })
    ;
    
    (function next (index) {
        if (index === 0) return cb(null, [])
        
        var terms = parts.slice(0, index).join(' ');
        find(terms, function (err, res) {
            if (err) return cb(err);
            if (res.length === 0) return next(index - 1);
            
            var matching = pivot(parts, index, res);
            if (matching.length) cb(null, matching.sort(cmp))
            else next(index - 1)
        });
        
        function cmp (a, b) {
            var am = a.name.toLowerCase() === terms;
            var bm = b.name.toLowerCase() === terms;
            if (am && !bm) return -1;
            if (bm && !am) return 1;
            
            return a.population < b.population ? 1 : -1;
        }
    })(parts.length);
};

function pivot (parts, index, res) {
    var extras = parts.slice(index).join(' ').split(RegExp(
        '(' + places.map(quotemeta).join('|') + ')\\b'
            + '|\\s',
        'i'
    )).filter(Boolean);
    
    return res.filter(function (row) {
        return extras.every(function (e) {
            var ue = e.toUpperCase();
            
            var x = row.country === ue
                || row.adminCode === ue
                || row.altCountry.toUpperCase() === ue
                || countries.getCode(e) === row.country
                || (allProvinces[ue]
                && allProvinces[ue].some(function (p) {
                    if (/^[A-Z]+$/.test(row.adminCode)
                    && p.short !== row.adminCode) {
                        return false;
                    }
                    return p.country === row.country;
                }))
            ;
            if (x) return true;
            
            var re = RegExp('^' + quotemeta(ue), 'i');
            return provinces.some(function (x) {
                if (/^[A-Z]+$/.test(row.adminCode)
                && x.short !== row.adminCode) {
                    return false;
                }
                return x.country === row.country && re.test(x.name);
            });
        });
    });
}
    
function find (query, cb) {
    var pending = 0, ended = false;
    var results = {};
    
    var qstream = db.createReadStream({
        start: query,
        end: query + '\uffff',
        limit: 500
    });
    qstream.on('error', cb);
    qstream.pipe(through(write, end));
    
    function write (r) {
        ++ pending;
        var key = r.key.split('!')[1];
        db.get(key, function (err, row) {
            if (err) return cb(err);
            
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
        cb(null, rows);
    }
}
