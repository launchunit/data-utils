
const fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  logUpdate = require('log-update'),
  uuid = require('uuid'),
  parsePath = require('parse-filepath');


/**
 * @param opts.inputFile
 * @param opts.inputFileAgainst
 * @param opts.outputFile
 * @param opts.uniqueField {String}
 **/
module.exports = function(opts) {

  var Count = 0;
  console.time('Processing Time');

  // Create the read and write streams
  const readerAgainst = fs.createReadStream(
                  path.resolve(opts.inputFileAgainst));

  const reader = fs.createReadStream(
                  path.resolve(opts.inputFile));

  if (opts.outputFile) {
    const writer = fs.createWriteStream(
      path.resolve(opts.outputFile));

    // Make sure the directory exits
    fs.ensureDirSync(
      path.resolve(parsePath(opts.outputFile).dirname));
  }

  // Create a Map for Unique Keys
  const UNIQUE_KEYS = new Set();


  return new Promise(function(resolve, reject) {

    readerAgainst
    .pipe(es.split())
    .pipe(es.parse())
    .pipe(es.map(function(item, cb) {
      UNIQUE_KEYS.add(item[opts.uniqueField]);
      return cb();
    }))
    .on('error', function(err) {
      return reject(err);
    })
    .on('end', function() {

      reader
      .pipe(es.split())
      .pipe(es.parse())
      .pipe(es.map(function(item, cb) {

        if (++Count % 9 === 0)
          logUpdate(`Processing Item: ${Count}`);

        if (UNIQUE_KEYS.has(item[opts.uniqueField])) {
          return cb();
        }

        return cb(null, JSON.stringify(item) + '\n');
      }))
      .pipe(writer)
      .on('error', function(err) {
        return reject(err);
      })
      .on('finish', function() {
        console.timeEnd('Processing Time');
        return resolve(Count);
      });

    });

  });
 }
