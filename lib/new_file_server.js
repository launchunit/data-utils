
const _ = require('lodash'),
  util = require('util'),
  fs = require('fs-extra'),
  es = require('event-stream'),
  path = require('path'),
  bodyParser = require('body-parser'),
  logUpdate = require('log-update'),
  newFile = require('./new_file');


/**
 *
 * require('./utils').newFileServer({
 *   port: (Optional, Default = 3000),
 *   append: false (Default = false),
 *   routes: {
 *     '/path1': {
 *        get: './output/result_path1.json',
 *        post: './output/result_path1.json'
 *     }
 *   }
 * }, function(serverClose) {
 *  serverClose(); // To shut down the server
 * });
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


  function handleRequest(route, method) {

    return method === 'post'
      ? (req, res, next) => {

        const statusCode = Object.keys(req.body).length
          ? 200 : 400;

        if (statusCode === 200) route.post.write(req.body);

        logUpdate(`Request #${++count}: ${req.method} ${req.url} ${statusCode}`);
        return res.sendStatus(statusCode);
      }

      : (req, res, next) => {

        res.json(Object.assign({}, route.get.data));
        logUpdate(`Request #${++count}: ${req.method} ${req.url}`);
        route.get.resume();
      };
  };


  // Normalise Keys
  opts.routes = _.mapKeys(opts.routes, (val, key) => {
    return key.trim().toLowerCase();
  });

  _.mapValues(opts.routes, (val, key) => {

    const route = {};

    // POST Request
    if (val.post) {
      // Open the File
      route.post = newFile(Object.assign({}, opts, {
        outputFile: val.post
      }));

      Server.post(key, handleRequest(route, 'post'));
    }

    // GET Request
    if (val.get) {

      route.get = {};

      fs.createReadStream(path.resolve(val.get))
        .pipe(es.split())
        .pipe(es.parse())
        .pipe(es.through(function write(data) {

          this.pause();

          if (typeof route.get.pause === 'undefined') {
            const self = this;
            route.get.pause = self.pause;
            route.get.resume = self.resume;
          }

          // Keep the Last Data
          route.get.data = data;
        },
        function end() {
          route.get.data = null;
          this.emit('end');
        }));

      Server.get(key, handleRequest(route, 'get'));
    }

    return route;
  });


  // Start the Server
  const S = Server.listen(opts.port || 3000, ()=> {

    console.log(`newFile Server Listening @ ${opts.port || 3000}`);
    console.log(`Routes: \n${util.inspect(opts.routes)}`);

    // End File Stream and Close Server
    return cb(function() {
      _.forEach(postFiles, (val, key) => {
        val.end();
      });
      S.close();
      logUpdate('newFile Server Shutting Down..');
    });

  });
};
