
process.chdir(__dirname);

/**
 * Utils Usage
 **/

Promise.resolve()

.then(function() {
  return require('./utils').processFile({
    inputFile: './output/results.json',
    outputFile: './output/results_processed.json',
    unique: 'link',
    mapItem: function(i) {
      return i;
    }
  });
})

.catch(function(err) {
  console.log(err);
});


/**
 * NewFile Usage
 *
 * NOTE: Does not return a promise
 **/
const File = require('./utils').newFile({
  outputFile: './output/results.json'
});

File.write('Hello');
File.write('World');
File.write({ name: 'Karan' });
