
const MongoClient = require('mongodb').MongoClient,
  Logger = require('mongodb').Logger;


/**
 * MongoDB
 *
 * @param opts.url
 * @param opts.debug (Optional) (Default: false)
 **/
module.exports = function(opts) {

  // Setting up Logger
  if (typeof opts.debug === 'undefined' || opts.debug) {
    Logger.setLevel('debug');
    Logger.filter('class', ['Mongos','Db','Collection','Cursor']);
  }


  return new Promise(function(resolve, reject) {

    // Connect (call only once)
    MongoClient.connect(opts.url, function(err, db) {

      if (err)
        throw new Error(`MongoDB connect failed: ${err.message}`);

      db.stats(function(err, stats) {
        console.log('MongoDB Conntected', db.writeConcern, stats);
        return resolve(db);
      });
    });

  });

 };
