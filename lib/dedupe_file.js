
const fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  logUpdate = require('log-update'),
  uuid = require('uuid'),
  parsePath = require('parse-filepath');


/**
 * @param opts.inputFile
 * @param opts.uniqueField {String}
    If null, then entire string is matched instead
    of the field of the object
 **/
module.exports = function(opts) {

  var Count = 0;
  console.time('Processing Time');


  const TMP_OUTPUT = `/tmp/${uuid.v4()}.json`;


  // Create the read and write streams
  const reader = fs.createReadStream(
                  path.resolve(opts.inputFile));

  const writer = fs.createWriteStream(TMP_OUTPUT);


  // Create a Map for Unique Keys
  const UNIQUE_KEYS = new Set();


  return new Promise(function(resolve, reject) {

    // Start the Parser
    const R1 = reader.pipe(es.split());

    // In Case of An Object, Parse Object
    if (opts.uniqueField !== null) {
      var R2 = R1.pipe(es.parse())
      .pipe(es.map(function(item, cb) {

        if (++Count % 9 === 0)
          logUpdate(`Processing Item: ${Count}`);

        // If Duplicate, Dont Propogate Down the Pipeline
        if (UNIQUE_KEYS.has(item[opts.uniqueField])) return cb();

        UNIQUE_KEYS.add(item[opts.uniqueField]);
        return cb(null, JSON.stringify(item) + '\n');
      }))
    }

    else {
      var R2 = R1.pipe(es.map(function(item, cb) {

        if (++Count % 9 === 0)
          logUpdate(`Processing Item: ${Count}`);

        item = item.toString();
        if (UNIQUE_KEYS.has(item)) return cb();

        UNIQUE_KEYS.add(item);
        return cb(null, item + '\n');
      }))
    }

    R2.pipe(writer)
      .on('finish', function() {

        try {
          fs.copySync(TMP_OUTPUT,
                      path.resolve(opts.inputFile));

          console.timeEnd('Processing Time');
          return resolve(Count);
        }
        catch (err) {
          return reject(err);
        }

      })
      .on('error', function(err) {
        return reject(err);
      });

  });
 }
