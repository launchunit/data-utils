
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
module.exports = function(opts) {

  var Count = 0, TaskCount = 0;
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
  const CONCURRENCY = opts.taskConcurrency || 10;


  // Create a Queue for task
  const Queue = async.queue(function(item, cb) {

    // Defer to next tick of the event loop.
    async.setImmediate(function () {
      opts.task(item, function() {
        if (++TaskCount % 9 === 0)
          logUpdate(`Processing Task Item: ${TaskCount}`);
        return cb();
      });
    });
  }, CONCURRENCY);


  return new Promise(function(resolve, reject) {

    // Start the Parser
    reader
      .pipe(es.split())
      .pipe(es.parse())
      .pipe(es.map(function(item, cb) {


        // Check if Returned Item is an Object
        const pipeData = () => {
          return (typeof item === 'object')
            ? cb(null, JSON.stringify(item) + '\n')
            : cb(null, item + '\n');
        };


        if (typeof opts.unique === 'string') {

          // If Duplicate, Dont Propogate Down the Pipeline
          if (UNIQUE_KEYS.has(item[opts.unique])) return cb();

          UNIQUE_KEYS.add(item[opts.unique]);
        }

        // Perform Action on Each Item
        if (opts.mapItem) {
          item = opts.mapItem(item);
          if (item === null || item === undefined) return cb();

          // Perform some task
          if (opts.task) {
            Queue.push(item);
          }

          return pipeData();
        }

        // Perform Async Action on Each Item
        else if (opts.mapItemAsync) {
          opts.mapItemAsync(item, function(Item) {
            if (Item === null || Item === undefined) return cb();
            item = Item;

            // Perform some task
            if (opts.task) {
              Queue.push(item);
            }

            return pipeData();
          });
        }

        else if (opts.task) {
          Queue.push(item);
          return pipeData();
        }

      }))
      .on('data', function() {
        if (++Count % 99 === 0)
          logUpdate(`Processing Item: ${Count}`);
      })
      .pipe(writer)
      .on('finish', function() {
        console.timeEnd('Processing Time');
        return resolve(Count);
      })
      .on('error', function(err) {
        return reject(err);
      });

  });
 }
