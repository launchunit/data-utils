
process.chdir(__dirname);

/**
 * Utils Usage
 **/

Promise.resolve()

.then(function() {
  return require('./utils').processFile({
    inputFile: './data/results.json',
    outputFile: './data/results_processed.json',
    unique: 'link',
    mapItem: function(i) {
      return i;
    }
  });
})

.catch(function(err) {
  console.log(err);
});


// ======================================


/**
 * MongoDB Usage
 **/
Promise.resolve()

.then(function() {
  return require('./mongodb')({
    url: process.env.MONGO_URL || ''
  });
})

.then(function(db) {
  return require('./mongodb/collection')(db, {
    collectionName: 'sample',
    indexes: [
      [ { abc: 1 }, { unique: true, sparse: false } ],
      [ { xyz: 1 }, { sparse: false } ]
    ]
  });
})

.then(function(db) {
  return require('./utils').processFile({
    inputFile: './data/results_processed.json',
    outputFile: './data/saved.json',
    task: function(item, cb) {

      const o = Object.assign({}, item, {
        created: new Date(item.created),
        abc: Number(item.abc)
      })

      db.collection.insertOne(o, function(e,d) {
        if (e) console.log(e);
        return cb();
      });
    }
  });
})

.catch(function(err) {
  console.log(err);
});
