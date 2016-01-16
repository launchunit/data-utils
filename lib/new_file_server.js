
const _ = require('lodash'),
  util = require('util'),
  bodyParser = require('body-parser'),
  logUpdate = require('log-update'),
  newFile = require('./new_file');


/**
 *
 * require('./utils').newFileServer({
 *   port: (Optional, Default = 3000),
 *   append: false (Default = false),
 *   postPath: {
 *    '*': './output/results.json',
 *   }
 * }, function(serverClose) {
 *  serverClose(); // To shut down the server
 * });
 *
 * HTTP POST json to postPath
 *
 **/
module.exports = function(opts, cb) {

  cb = cb || function(){};

  var count = 0;

  // Server & JSON Parser
  const Server = require('express')();
  Server.use(bodyParser.json({
    inflate: false,
    strict: true
  }));

  // Build Out the Files & Routes
  opts.postPath = _.mapKeys(opts.postPath, (val, key) => {
    return key.trim().toLowerCase();
  });

  const Files = _.mapValues(opts.postPath, (val, key) => {

    // Build Out the Server POST Paths
    Server.post(key, request);

    return newFile(Object.assign({}, opts, {
      outputFile: val
    }));
  });

  function request(req, res, next) {
    const statusCode = Object.keys(req.body).length
      ? 200 : 400;

    if (statusCode === 200) {
      Files[req.url.toLowerCase()].write(req.body);
    }

    logUpdate(`Request #${++count}: ${req.method} ${req.url} ${statusCode}`);
    return res.sendStatus(statusCode);
  }


  // Start the Server
  const S = Server.listen(opts.port || 3000, ()=> {

    logUpdate(`newFile Server Listening @ ${opts.port || 3000}`);
    logUpdate(`POST Routes: \n${util.inspect(opts.postPath)}`);

    // End File Stream and Close Server
    return cb(function() {
      _.forEach(Files, (val, key) => {
        val.end();
      });
      S.close();
      logUpdate('newFile Server Shutting Down..');
    });

  });
};
