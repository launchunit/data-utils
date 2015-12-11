
/**
 * Examples

  require('./utils').jsonToCsv({
    separator: '|', (Optional)
    inputFile: './data/results.json',
    outputFile: './data/results.csv'
  });

  require('./utils').csvToJson({
    separator: '|', (Optional)
    inputFile: './data/results.csv',
    outputFile: './data/results.json'
  });

  require('./utils').fileSplitter({
    maxRows: 100000, (Optional)
    inputFile: './data/results.json',
    outputFile: './data/output/op_${count}.json'
  });

  require('./utils').processFile({
    inputFile: './data/results.json',
    outputFile: './data/results2.json',
    unique: 'id', // Key for unique-ness (Optional)
    mapItem: function(i) { return i; } (Optional)
    task: function(i, cb) { return cb() }, (Optional)
  });
 *
**/

exports.csvToJson = require('./lib/csv_to_json');
exports.jsonToCsv = require('./lib/json_to_csv');
exports.fileSplitter = require('./lib/file_splitter');
exports.processFile = require('./lib/process_file');
