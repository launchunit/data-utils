
const test = require('ava');


test.cb('newFile', t => {

  const File = require('../').newFile({
    outputFile: '../output/test1.json',
    append: false
  });

  // Callback is optional
  File.write('Some String w/ Callback', () => {
    t.ok('Callback of Some String');
  });

  File.write('Another String no Callback');

  File.write({ a:1, b: 2 });
  File.write({ a:3, b: 4 });
  File.write({ a:5, b: 6 });
  File.write({ a:7, b: 8 });

  File.end(() => {
    t.pass('Close File');
    t.end();
  });
});


test.serial('newFile w/ Append Argument Not Passed', t => {

  const File = require('../').newFile({
    outputFile: '../output/test1_b.json'
  });

  // Callback is optional
  File.write('Some String w/ Callback', () => {
    t.ok('Callback of Some String');
  });

  File.write('Another String no Callback');

  File.write({ a:1, b: 2 });
  File.write({ a:3, b: 4 });
  File.write({ a:5, b: 6 });
  File.write({ a:7, b: 8 });

  File.end(() => {
    t.pass('Close File');
  });
});


test.serial('newFile w/ Append Mode', t => {

  const File = require('../').newFile({
    outputFile: '../output/test1.json',
    append: true
  });

  // Callback is optional
  File.write('Some String w/ Callback', () => {
    t.ok('Callback of Some String');
  });

  File.write('Another String no Callback');

  File.write({ a:1, b: 2 });
  File.write({ a:3, b: 4 });
  File.write({ a:5, b: 6 });
  File.write({ a:7, b: 8 });

  File.end(() => {
    t.pass('Close File');
  });
});


test.serial('jsonToCsv', t => {

  return require('../').jsonToCsv({
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

  return require('../').csvToJson({
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

  return require('../').fileSplitter({
    maxRows: 2, // (Optional)
    inputFile: '../output/test3.json',
    outputFile: '../output/splits/${count}.json'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('processFile', t => {

  return require('../').processFile({
    inputFile: '../output/test3.json',
    outputFile: '../output/test4.json',
    mapItem: function(i) {
      i.item = 'superman_'+Date.now();
      return i;
    },
    task: function(i, cb) {
      return cb()
    }
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('processFile w/o outputFile', t => {

  return require('../').processFile({
    inputFile: '../output/test3.json',
    mapItem: function(i) {
      i.item = 'superman_'+Date.now();
      return i;
    },
    task: function(i, cb) {
      return cb()
    }
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('processFile mapItemAsync', t => {

  return require('../').processFile({
    inputFile: '../output/test4.json',
    outputFile: '../output/test5.json',
    mapItemAsync: function(i, cb) {
      i.item = 'superman_'+Date.now();

      setTimeout(function() {
        return cb(i);
      }, 5000);
    },
    task: function(i, cb) {
      return cb()
    }
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('processFile mapItemAsync w/ mapAsyncConcurrency', t => {

  return require('../').processFile({
    inputFile: '../output/test4.json',
    outputFile: '../output/test5.json',
    mapItemAsync: function(i, cb) {
      i.item = 'superman_'+Date.now();

      setTimeout(function() {
        return cb(i);
      }, 2000);
    },
    mapAsyncConcurrency: 2,
    task: function(i, cb) {
      return cb()
    }
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('dedupeFile', t => {

  return require('../').dedupeFile({
    inputFile: '../output/test4.json',
    uniqueField: 'a'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.serial('dedupeFile When Data is String', t => {

  return require('../').dedupeFile({
    inputFile: '../output/test2.csv',
    uniqueField: null
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});


test.cb('newFileServer', t => {

  require('../').newFileServer({
    // append: true,
    routes: {
      '/Path1': {
        post: '../output/test_server_path1.json',
        get: '../output/test4.json',
      },
      '/path2': {
        post: '../output/test_server_path2.json',
        get: '../output/test5.json',
      }
    }
  }, function(serverClose) {
    t.ok(typeof serverClose === 'function');
  });
});


test.serial('diffFile', t => {

  return require('../').diffFile({
    inputFile: '../output/test_diff.json',
    inputFileAgainst: '../output/test_diff_against.json',
    outputFile: '../output/test_diff_result.json',
    uniqueField: 'id'
  })
  .then(function(res) {
    t.ok(typeof res === 'number');
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});
