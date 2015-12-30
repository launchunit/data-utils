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

// If uniqueField=null, then entire string is matched instead
// of the field of the object
require('./').dedupeFile({
  inputFile: './output/test4.json',
  uniqueField: 'a'
});

/**
 * @param opts.inputFile
 * @param opts.outputFile
 * @param opts.unique (Optional)
 *        @return - If Not Unique, task is not run &
 *                  data not passed down the pipeline
 *
 * @param opts.mapItem (Optional)
 *        @return - If return null, task is not run &
 *                  data not passed down the pipeline
 *
 * @param opts.mapItemAsync (Optional)
 *        @return cb(data)
 *          If return null, task is not run &
 *          data not passed down the pipeline

 * Note: mapItem & mapItemAsync are exclusive
 *
 * @param opts.task (Optional) - return cb();
 * @param opts.taskConcurrency (Optional) Default = 10
 **/
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
  append: false (Default = false)
});
// Callback is optional
File.write('some string');
File.write({ a:1, b: 2 });
File.end();

// Zipcodes
require('./').zipcodes.stateMap;
require('./').zipcodes.codes;
```
