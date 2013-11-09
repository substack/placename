# placename

find a normalized place name and lat/lon from a free-form location query

[![build status](https://secure.travis-ci.org/substack/placename.png)](http://travis-ci.org/substack/placename)

# example

``` js
var placename = require('placename');
var query = process.argv.slice(2).join(' ');

placename(query, function (err, rows) {
    console.log(rows);
});
```

```
$ node example/search.js oakland, cali
[ { name: 'Oakland',
    country: 'US',
    altCountry: '',
    muni: '',
    muniSub: '',
    featureClass: 'P',
    featureCode: 'PPLA2',
    adminCode: 'CA',
    population: 390724,
    lat: 37.80437,
    lon: -122.2708,
    from: 'oakland' } ]
```

```
$ node example/search.js 吉林
[ { name: 'Jilin',
    country: 'CN',
    altCountry: '',
    muni: '',
    muniSub: '',
    featureClass: 'P',
    featureCode: 'PPL',
    adminCode: '05',
    population: 1881977,
    lat: 43.85083,
    lon: 126.56028,
    from: '吉林市' } ]
```

# methods

``` js
var placename = require('placename')
```

## placename(query, cb)

Search for a city with a free-form location string `query`.

`cb(err, results)` fires with an array `results` containing all the matches.

# usage

There's also a `placename` command that you can install with `npm install -g
placename`.

```
usage: placename QUERY... {OPTIONS}

  -n  limit results to `n` entries
  -s  show short text output instead of json

```

# install

With [npm](https://npmjs.org) do:

```
npm install placename
```

# license

MIT
