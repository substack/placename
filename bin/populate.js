#!/usr/bin/env node

var fs = require('fs');
var split = require('split');
var through = require('through');

var level = require('level');
var db = level(__dirname + '/../data', { encoding: 'json' });

var cities = require('cities1000');

console.error('Generating the index. This could take a minute or two.');
console.error('Please wait...');

fs.createReadStream(cities.file)
    .pipe(split())
    .pipe(through(function (line) {
        var row = line.split('\t').reduce(function (acc, x, ix) {
            var key = cities.fields[ix];
            if (key === 'alternativeNames') x = x.split(',');
            if (key === 'lat' || key === 'lon') x = parseFloat(x);
            if (key === 'elevation') x = x ? parseInt(x, 10) : undefined;
            if (key === 'population') x = x ? parseInt(x, 10) : undefined;
            
            acc[key] = x;
            return acc;
        }, {});
        if (!row.id) return;
        
        db.put(row.id, {
            name: row.name,
            country: row.country,
            altCountry: row.altCountry,
            muni: row.municipality,
            muniSub: row.municipalitySubdivision,
            featureClass: row.featureClass,
            featureCode: row.featureCode,
            adminCode: row.adminCode,
            population: row.population,
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon)
        });
        
        db.put(row.name.toLowerCase() + '!' + row.id, 0);
        row.alternativeNames.forEach(function (alt) {
            db.put(alt.toLowerCase() + '!' + row.id, 0);
        });
    }))
;
