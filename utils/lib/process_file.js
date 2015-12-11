
const fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  logUpdate = require('log-update'),
  async = require('async'),
  parsePath = require('parse-filepath');


/**
 * @param opts.inputFile
 * @param opts.outputFile
 * @param opts.unique (Optional)
 * @param opts.mapItem (Optional)
 * @param opts.task (Optional) - return cb();
 **/
module.exports = function(opts) {

  var Count = 0;
  console.time('Processing Time');


  // Make sure the directory exits
  fs.ensureDirSync(
    path.resolve(parsePath(opts.outputFile).dirname));

  // Create the read and write streams
  const reader = fs.createReadStream(
                  path.resolve(opts.inputFile));

  const writer = fs.createWriteStream(
                  path.resolve(opts.outputFile));


  // Create a Map for Unique Keys
  const UNIQUE_KEYS = new Set();


  // Create a Queue for task
  const Queue = async.queue(function(o, cb) {

    // Defer to next tick of the event loop.
    async.setImmediate(function () {

      opts.task(o.item, function() {
        o.cb(null, JSON.stringify(o.item) + '\n');
        return cb();
      });
    });
  }, 50);


  return new Promise(function(resolve, reject) {

    // Start the Parser
    reader
      .pipe(es.split())
      .pipe(es.parse())
      .pipe(es.map(function(item, cb) {

        if (typeof opts.unique === 'string') {

          // If duplicate, dont propogate data
          if (UNIQUE_KEYS.has(item[opts.unique])) return cb();

          UNIQUE_KEYS.add(item[opts.unique]);
        }

        // Perform Action on Each Item
        if (opts.mapItem) item = opts.mapItem(item);

        // Perform some task
        if (opts.task) {
          Queue.push({ item, cb: cb });
        }

        else return cb(null, JSON.stringify(item) + '\n');
      }))
      .on('data', function() {
        if (++Count % 99 === 0)
          logUpdate(`Processing Item: ${Count}`);
      })
      .pipe(writer)
      .on('finish', function() {
        console.timeEnd('Processing Time');
        return resolve();
      })
      .on('error', function(err) {
        return reject(err);
      });

  });
 }
