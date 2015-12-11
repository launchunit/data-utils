
const async = require('async');


/**
 * MongoDB Collection Things
 *
 * @param db instance
 * @param opts.collectionName
 * @param opts.indexes (Optional)
 **/
module.exports = function(db, opts) {

  const collection = db.collection(opts.collectionName);


  return new Promise(function(resolve, reject) {

    // Build out Indexes
    // https://docs.mongodb.org/manual/reference/method/db.collection.createIndex/#db.collection.createIndex
    if (Array.isArray(opts.indexes)) {

      async.each(opts.indexes, function(i, cb) {

        // Make Background by Default
        var o = Object.assign({
          background: true
        }, i[1]);

        collection.createIndex(i[0], o, cb);
      },
      function(err) {
        if (err) return reject(err);
        return resolve({ collection: collection, db: db });
      });
    }

    else return resolve({ collection: collection, db: db });
  });

};
