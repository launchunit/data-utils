# Data-Utils

1. Directory `zipcodes` contains all the zipcodes.
2. Directory `utils` contains data utilites.

```js
// NOTE: Everything Returns a Promise

require('./utils').jsonToCsv({
  separator: '|', (Optional)
  inputFile: './output/results.json',
  outputFile: './output/results.csv'
});

require('./utils').csvToJson({
  separator: '|', (Optional)
  inputFile: './output/results.csv',
  outputFile: './output/results.json'
});

require('./utils').fileSplitter({
  maxRows: 100000, (Optional)
  inputFile: './output/results.json',
  outputFile: './output/output/op_${count}.json'
});

require('./utils').processFile({
  inputFile: './output/results.json',
  outputFile: './output/results2.json',
  unique: 'id', // Key for unique-ness (Optional)
  mapItem: function(i) { return i; }, (Optional) // (if return null, then not passed down the pipeline)
  task: function(i, cb) { return cb() }, (Optional)
  taskConcurrency: 50 (Optional)
});
```
