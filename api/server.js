const Fastify = require('fastify');
const path = require('path');
const AutoLoad = require('fastify-autoload');
const uuidv4 = require('uuid/v4');

// create request ids
const createRequestId = () => uuidv4();
// create the server
const server = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    genReqId: createRequestId,
    level: 'info'
  }
});

const createServer = (options) => {
  const { logSeverity } = options;
  // create the server
  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: {
      genReqId: createRequestId,
      level: logSeverity
    }
  });

  server.register(AutoLoad, {
    dir: path.join(__dirname, 'routes')
  });

  // start the server
  server.listen(3031, '0.0.0.0', (err) => {
    if (err) {
      server.log.error(err);
      console.log(err);
      process.exit(1);
    }
    server.log.info('Server Started');
  });
}

module.exports = {
  createServer
}
