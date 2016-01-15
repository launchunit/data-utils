
const del = require('del');

/**
 * @param opts.inputFiles (Array)
 **/
module.exports = function(opts) {
  return del(opts.inputFiles);
};
