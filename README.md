# Data-Utils

```js
// NOTE: Everything Returns a Promise, unless stated
require('./').jsonToCsv({
  separator: '|', (Optional)
  inputFile: './output/results.json',
  outputFile: './output/results.csv'
});

require('./').csvToJson({
  separator: '|', (Optional)
  inputFile: './output/results.csv',
  outputFile: './output/results.json'
});

require('./').fileSplitter({
  maxRows: 100000, (Optional)
  inputFile: './output/results.json',
  outputFile: './output/output/op_${count}.json'
});

require('./').processFile({
  inputFile: './output/results.json',
  outputFile: './output/results2.json',
  unique: 'id', // Key for unique-ness (Optional)
  mapItem: function(i) { return i; }, (Optional) // (if return null, then not passed down the pipeline)
  task: function(i, cb) { return cb() }, (Optional)
  taskConcurrency: 50 (Optional)
});

// Not a Promise
const File = require('./').newFile({
  outputFile: './output/results.json',
});
// Callback is optional
File.write('some string');
File.write({ a:1, b: 2 });
File.end();

// Zipcodes
require('./').zipcodes.stateMap;
require('./').zipcodes.codes;
```
