
const fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  logUpdate = require('log-update'),
  parsePath = require('parse-filepath'),
  StreamParser = require('json2csv-stream');


/**
 * @param opts.inputFile
 * @param opts.outputFile
 * @param opts.separator (Optional)
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


  return new Promise(function(resolve, reject) {

    // Start the Parser
    reader
      .pipe(new StreamParser({
        del: opts.separator
      }))
      .on('data', function() {
        if (++Count % 9999 === 0)
          logUpdate(`Processing Item: ${Count}`);
      })
      .on('error', function(err) {
        return reject(err);
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
