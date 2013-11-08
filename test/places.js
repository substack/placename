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

test('province name', function (t) {
    t.plan(12);
    
    find('vancouver, bc', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].country, 'CA');
    });
    
    find('vancouver, ca', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].country, 'CA');
    });
    
    find('vancouver, bc, canada', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].country, 'CA');
    });
    
    find('vancouver, wa', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].country, 'US');
        t.equal(rows[0].adminCode, 'WA');
    });
    
    find('vancouver, us', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].country, 'US');
        t.equal(rows[0].adminCode, 'WA');
    });
});

test('ad-hoc abbreviation', function (t) {
    t.plan(4);
    
    find('oakland, cali.', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].lat, 37.80437);
        t.equal(rows[0].lon, -122.2708);
    });
});
