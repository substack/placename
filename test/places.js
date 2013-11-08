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

test('special abbreviations', function (t) {
    t.plan(7);
    
    find('oakland, california, usa', function (err, rows) {
        t.equal(rows.length, 1);
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].lat, 37.80437);
        t.equal(rows[0].lon, -122.2708);
    });
    
    find('london, uk', function (err, rows) {
        t.equal(rows[0].country, 'GB');
    });
    
    find('london, usa', function (err, rows) {
        t.equal(rows[0].name, 'London');
        t.equal(rows[0].country, 'US');
    });
});

test('better pivots', function (t) {
    t.plan(3);
    
    find('sfo', function (err, rows) {
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].country, 'US');
        t.equal(rows[0].name, 'San Francisco');
    });
});

test('san francisco', function (t) {
    t.plan(3);
    
    find('san francisco, usa', function (err, rows) {
        t.equal(rows[0].adminCode, 'CA');
        t.equal(rows[0].country, 'US');
        t.equal(rows[0].name, 'San Francisco');
    });
});

test('london', function (t) {
    t.plan(2);
    
    find('london', function (err, rows) {
        t.equal(rows[0].country, 'GB');
        t.equal(rows[0].name, 'London');
    });
});
