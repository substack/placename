var test = require('tape');
var find = require('../');

test('cities', function (t) {
    t.plan(3);
    
    find('oakland', function (err, rows) {
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].lat, 37.80437);
        t.equal(rows[0].lon, -122.2708);
    });
});

test('US city with state', function (t) {
    t.plan(3);
    
    find('oakland, ca', function (err, rows) {
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].lat, 37.80437);
        t.equal(rows[0].lon, -122.2708);
    });
});

test('US city with full state name', function (t) {
    t.plan(3);
    
    find('oakland, california', function (err, rows) {
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].lat, 37.80437);
        t.equal(rows[0].lon, -122.2708);
    });
});
