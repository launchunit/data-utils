
const fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  logUpdate = require('log-update'),
  parsePath = require('parse-filepath'),
  CsvParser = require('csv-parser');


/**
 * @param opts.inputFile
 * @param opts.outputFile
 * @param opts.separator (Optional)
 **/
module.exports = function(opts) {

  console.time('Processing Time');
  var Count = 0;


  // Make sure the directory exits
  fs.ensureDirSync(
    path.resolve(parsePath(opts.outputFile).dirname));

  // Create the read and write streams
  const reader = fs.createReadStream(
                  path.resolve(opts.inputFile));

  const writer = fs.createWriteStream(
                  path.resolve(opts.outputFile));


  return new Promise(function(resolve, reject) {

    // Start the Parser
    reader
      .pipe(CsvParser({
        separator: opts.separator,
        strict: false
      }))
      .on('error', function(err) {
        return reject(err);
      })
      .pipe(es.mapSync(function(item) {
        if (++Count % 9999 === 0)
          logUpdate(`Processing Item: ${Count}`);

        return JSON.stringify(item) + '\n';
      }))
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
