
const test = require('ava');


test.serial('newFile', t => {

  const File = require('../').newFile({
    outputFile: '../output/test1.json',
  });

  // Callback is optional
  File.write('Some String w/ Callback', () => {
    t.ok('Callback of Some String');
  });

  File.write('Another String no Callback');

  File.write({ a:1, b: 2 });

  File.end(() => {
    t.pass('Close File');
  });
});


test.serial('jsonToCsv', t => {

  require('../').jsonToCsv({
    separator: '|', // (Optional)
    inputFile: '../output/test1.json',
    outputFile: '../output/test2.csv'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });

});


test.serial('csvToJson', t => {

  require('../').csvToJson({
    separator: '|', // (Optional)
    inputFile: '../output/test2.csv',
    outputFile: '../output/test3.json'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });

});


test.serial('fileSplitter', t => {

  require('../').fileSplitter({
    maxRows: 10, // (Optional)
    inputFile: '../output/results.json',
    outputFile: '../output/splits/${count}.json'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});
