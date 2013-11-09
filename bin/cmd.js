#!/usr/bin/env node

var fs = require('fs');
var find = require('../');
var argv = require('optimist').boolean(['s']).argv;
var query = argv._.join(' ');

if (argv.h || argv.help || argv._.length === 0) {
    fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
    return;
}

find(query, function (err, rows) {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }
    if (argv.n) rows = rows.slice(0, argv.n);
    if (argv.s) {
        rows.forEach(function (r) {
            console.log([
                r.name,
                /^[A-Z]+$/.test(r.adminCode) && r.adminCode,
                r.country, r.lat, r.lon
            ].filter(Boolean).join(', '));
        });
    }
    else console.log(JSON.stringify(rows, null, 2));
});
