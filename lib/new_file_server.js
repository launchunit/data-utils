
const bodyParser = require('body-parser'),
  logUpdate = require('log-update'),
  newFile = require('./new_file');


/**
 *
 * require('./utils').newFileServer({
 *   outputFile: './output/results.json',
 *   port: (Optional, Default = 3000),
 *   append: false (Default = false),
 * }, function(serverClose) {
 *  serverClose(); // To shut down the server
 * });
 *
 * HTTP POST json to postPath
 *
 **/
module.exports = function(opts, cb) {

  cb = cb || function(){};

  const File = newFile(opts);

  // Server & JSON Parser
  const Server = require('express')();
  Server.use(bodyParser.json({
    inflate: false,
    strict: true
  }));

  Server.post('*', (req,res,next) => {

    const statusCode = Object.keys(req.body).length
      ? 200 : 400;

    if (statusCode === 200) File.write(req.body);

    logUpdate(`Request: ${req.method} ${req.url} ${statusCode}`);
    return res.sendStatus(statusCode);
  });


  // Start the Server
  const S = Server.listen(opts.port || 3000, ()=> {

    logUpdate(`newFile Server Listening @ ${opts.port || 3000}`);

    // End File Stream and Close Server
    return cb(function() {
      File.end();
      logUpdate('newFile Server Shutting Down..');
      S.close();
    });

  });
};
