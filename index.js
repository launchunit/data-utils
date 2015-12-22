
/**
 * Examples

  require('./utils').jsonToCsv({
    separator: '|', (Optional)
    inputFile: './output/results.json',
    outputFile: './output/results.csv'
  });

  require('./utils').csvToJson({
    separator: '|', (Optional)
    inputFile: './output/results.csv',
    outputFile: './output/results.json'
  });

  require('./utils').fileSplitter({
    maxRows: 100000, (Optional)
    inputFile: './output/results.json',
    outputFile: './output/output/op_${count}.json'
  });


  * @param opts.inputFile
  * @param opts.uniqueField {String}
      If null, then entire string is matched instead
      of the field of the object
  require('./').dedupeFile({
    inputFile: './output/test4.json',
    uniqueField: 'a'
  });


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
  * @param opts.task (Optional) - return cb();
  * @param opts.taskConcurrency (Optional) Default = 10

  require('./utils').processFile({
    inputFile: './output/results.json',
    outputFile: './output/results2.json',
    unique: 'id', // Key for unique-ness (Optional)
    mapItem: function(i) { return i; } (Optional)
    task: function(i, cb) { return cb() }, (Optional)
    taskConcurrency: 10 (Optional)
  });

  const File = require('./utils').newFile({
    outputFile: './output/results.json',
  });
  // Callback is optional
  File.write('some string');
  File.write({ a:1, b: 2 });
  File.end();
 *
**/

// Data Utils
exports.csvToJson = require('./lib/csv_to_json');
exports.jsonToCsv = require('./lib/json_to_csv');
exports.fileSplitter = require('./lib/file_splitter');
exports.processFile = require('./lib/process_file');
exports.newFile = require('./lib/new_file');
exports.dedupeFile = require('./lib/dedupe_file');

// Zipcodes
exports.zipcodes = require('./lib/zipcodes');
