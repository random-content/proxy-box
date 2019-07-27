const convict = require('convict');

const config = convict({
  httpPort: {
    doc: 'The port to listen on for HTTP. If 0, HTTP listening will be disabled.',
    format: 'port',
    default: 0,
    env: 'HTTP_PORT',
    arg: 'http'
  },
  httpsPort: {
    doc: 'The port to listen on for HTTPS. If 0, HTTPS listening will be disabled.',
    format: 'port',
    default: 0,
    env: 'HTTPS_PORT',
    arg: 'https'
  },
  target: {
    doc: 'The proxy target URL.',
    format: 'url',
    default: null,
    env: 'TARGET',
    arg: 'target'
  },
  cors: {
    doc: 'Whether to enable CORS handling.',
    format: Boolean,
    default: false,
    env: 'ENABLE_CORS',
    arg: 'cors'
  }
});

config.validate({ allowed: 'strict' });

module.exports = config;
