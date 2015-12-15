
process.chdir(__dirname);

/**
 * Utils Usage
 **/

Promise.resolve()

.then(function() {
  return require('./utils').processFile({
    inputFile: './output/results.json',
    outputFile: './output/results_processed.json',
    // unique: 'link',
    mapItem: function(i) {
      if (i.updatedAt) i.updatedAt = new Date(i.updatedAt);
      if (i.createdAt) i.createdAt = new Date(i.createdAt);
      if (i.dateAvailable) i.dateAvailable = new Date(i.dateAvailable);
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

// const File = require('./utils').newFile({
//   outputFile: './output/results.json'
// });

// File.write('Hello');
// File.write('World');
// File.write({ name: 'Karan' });
// File.end();
