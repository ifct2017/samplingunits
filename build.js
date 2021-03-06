const csv = require('csv');
const fs = require('fs');
const os = require('os');

var map = new Map();
var stream = fs.createReadStream('index.csv').pipe(csv.parse({columns: true, comment: '#'}));




function writeFile(pth, d) {
  d = d.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, d);
}


stream.on('data', r => {
  r.districts = parseInt(r.districts, 10);
  r.selected = parseInt(r.selected, 10);
  map.set(r.sno, r);
});

stream.on('end', () => {
  var a = `var CORPUS = new Map([\n`;
  for (var [k, v] of map)
    a += `  ["${k}", ${JSON.stringify(v).replace(/\"(\w+)\":/g, '$1:')}],\n`;
  a += `]);\n`;
  a += `module.exports = CORPUS;\n`;
  writeFile('corpus.js', a);
});
