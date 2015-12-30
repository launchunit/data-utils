
const appendStream = require('append-stream'),
  fs = require('fs-extra'),
  parsePath = require('parse-filepath'),
  path = require('path'),
  bodyParser = require('body-parser'),
  logUpdate = require('log-update');


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

  console.time('Processing Time');
  var Count = 0;


  // Make sure the directory exits
  fs.ensureDirSync(
    path.resolve(parsePath(opts.outputFile).dirname));

  // Create the write streams
  const writer = new appendStream(path.resolve(opts.outputFile), {
    flags: opts.append === true ? 'a' : undefined
  });


  // Server
  const Server = require('express')()
  // Express Settings
  Server.disable('x-powered-by');
  Server.set('etag', false);
  Server.set('query parser', 'simple');
  Server.set('trust proxy', false);
  Server.disable('strict routing');
  Server.disable('view cache');
  delete Server.locals;

  // Bodyparser
  Server.use(bodyParser.json({
    inflate: false,
    strict: true
  }));

  Server.post('*', (req,res,next) => {

    logUpdate(`Request: ${req.method} ${req.url} Processing Item: ${++Count}`);

    // Stringify Object
    if (Object.keys(req.body).length) {
      // Write to Stream
      writer.write(JSON.stringify(req.body)+'\n', function() {
        return res.sendStatus(200);
      });
    }

    else return res.sendStatus(400);
  });


  // Start the Server
  const S = Server.listen(opts.port || 3000, ()=> {

    logUpdate(`newFile Server Listening @ ${opts.port || 3000}`);

    // End File Stream and Close Server
    return cb(function() {
      writer.end(function(){
        console.timeEnd('Processing Time');
        logUpdate('newFile Server Shutting Down..');
        S.close();
      });
    });

  });
};
