
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

  require('./utils').processFile({
    inputFile: './output/results.json',
    outputFile: './output/results2.json',
    unique: 'id', // Key for unique-ness (Optional)
    mapItem: function(i) { return i; } (Optional)
    task: function(i, cb) { return cb() }, (Optional)
    taskConcurrency: 50 (Optional)
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

exports.csvToJson = require('./lib/csv_to_json');
exports.jsonToCsv = require('./lib/json_to_csv');
exports.fileSplitter = require('./lib/file_splitter');
exports.processFile = require('./lib/process_file');
exports.newFile = require('./lib/new_file');
