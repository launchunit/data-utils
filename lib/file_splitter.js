
const es = require('event-stream'),
  appendStream = require('append-stream'),
  fs = require('fs-extra'),
  parsePath = require('parse-filepath'),
  path = require('path'),
  logUpdate = require('log-update');


/**
 * @params opts.maxRows - Default 100000
 * @params opts.inputFile: './output/results.json',
 * @params opts.outputFile: './output/output/op_${count}.json'
 **/
module.exports = function(opts) {

  console.time('Processing Time');

  var Count = -1, splitCount = 0;
  opts.maxRows = opts.maxRows || 10000;


  // Make sure the directory exits
  fs.ensureDirSync(
    path.resolve(parsePath(opts.outputFile).dirname));

  // Create the read and write streams
  const reader = fs.createReadStream(
                  path.resolve(opts.inputFile));


  // Create an Output Steam
  const writerMap = {};
  const writerFile = new Function('count',
                        'return '+'`'+opts.outputFile+'`');

  function createWriter(count) {
    const o = path.resolve(writerFile(count));
    writerMap[count] = new appendStream(o);
    // , { lazy: true });
  };


  return new Promise(function(resolve, reject) {

    // Start Processing
    reader
      .pipe(es.split())
      .pipe(es.map(function(item, cb) {

        // Keeping Tabs of Things
        const currentCount = Count + 1;
        ++Count;

        if (currentCount % opts.maxRows === 0) {

          const currentSplitCount = splitCount + 1;

          writerMap[splitCount] &&
          writerMap[splitCount].end();

          ++splitCount;

          createWriter(currentSplitCount);
          writerMap[currentSplitCount].write(item+'\n', cb);

        } else {

          if (currentCount % 9999 === 0)
            logUpdate(`Processing Item: ${currentCount}`);

          writerMap[splitCount].write(item+'\n', cb);
        }
      }))
      .on('end', function() {
        console.timeEnd('Processing Time');
        return resolve(splitCount);
      })
      .on('error', function(err) {
        return reject(err);
      });

  });
};
