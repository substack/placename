var find = require('../');
var query = process.argv.slice(2).join(' ');

find(query, function (err, rows) {
    console.log(rows);
});
