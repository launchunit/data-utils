
const appendStream = require('append-stream'),
  fs = require('fs-extra'),
  parsePath = require('parse-filepath'),
  path = require('path'),
  logUpdate = require('log-update');


/**
 * @params opts.outputFile: './output/results.json'

    const File = require('./utils').newFile({
      outputFile: './output/results.json',
    });
    // Callback is optional
    File.write('some string');
    File.write({ a:1, b: 2 });
    File.end();
 *
 **/
module.exports = function(opts) {


  console.time('Processing Time');
  var Count = 0;


  // Make sure the directory exits
  fs.ensureDirSync(
    path.resolve(parsePath(opts.outputFile).dirname));

  // Create the write streams

  const writer = new appendStream(path.resolve(opts.outputFile), {
                  lazy: true });

  return {
    write: (item, cb) => {

      cb = cb || function(){};

      if (++Count % 9999 === 0)
        logUpdate(`Processing Item: ${Count}`);


      // Stringify Object
      if (typeof item === 'object') {
        try {
          item = JSON.stringify(item);
        } catch(e) {}
      }

      // Write to Stream
      writer.write(item+'\n', cb);
    },

    end: cb => {
      console.timeEnd('Processing Time');
      writer.end(cb || function(){});
    }
  };

};
