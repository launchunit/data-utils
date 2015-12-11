# Data-Utils

1. Directory `zipcodes` contains all the zipcodes.
2. Directory `utils` contains data utilites.

```js
// NOTE: Everything Returns a Promise

require('./utils').jsonToCsv({
  separator: '|', (Optional)
  inputFile: './data/results.json',
  outputFile: './data/results.csv'
});

require('./utils').csvToJson({
  separator: '|', (Optional)
  inputFile: './data/results.csv',
  outputFile: './data/results.json'
});

require('./utils').fileSplitter({
  maxRows: 100000, (Optional)
  inputFile: './data/results.json',
  outputFile: './data/output/op_${count}.json'
});

require('./utils').processFile({
  inputFile: './data/results.json',
  outputFile: './data/results2.json',
  unique: 'id', // Key for unique-ness (Optional)
  mapItem: function(i) { return i; }, (Optional)
  task: function(i, cb) { return cb() }, (Optional)
});
```

3. Directory `mongodb` contains mongodb connector & utilites.

```js
// NOTE: Everything Returns a Promise

// Create a connection @return db instance
return require('./mongodb')({
  url: process.env.MONGO_URL || ''
});

// Init a collection
var db = return require('./mongodb/collection')(db, {
  collectionName: 'sample',
  indexes: [
    [ { abc: 1 }, { unique: true, sparse: false } ],
    [ { xyz: 1 }, { sparse: false } ]
  ]
});

// Perform action on above collection
db.collection.insertOne(o, function(e,d) {
  if (e) console.log(e);
  return cb();
});
```
