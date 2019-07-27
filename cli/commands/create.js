const _ = require('lodash');

function missingPort(port) {
  return _.isNil(port) || _.isNaN(port);
}

function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to create',
    type: 'string'
  })
    .option('file', {
      alias: 'f',
      describe: 'Path to a proxy-box config file',
      config: true
    })
    .option('http', {
      describe: 'Port for HTTP listener',
      type: 'number'
    })
    .option('https', {
      describe: 'Port for HTTPS listener',
      type: 'number'
    })
    .option('cors', {
      describe: 'Whether to enable CORS handling',
      boolean: true
    })
    .option('target', {
      describe: 'Proxy target',
      type: 'string',
      demandOption: true
    })
    .option('version', {
      hidden: true
    })
    .check(({ http, https }) => {
      if (missingPort(http) && missingPort(https)) {
        throw new Error('At least one of http, https is required');
      }

      return true;
    });

  return yargs;
}

module.exports = {
  command: 'create <name>',
  describe: 'Create a new proxy-box instance',
  builder
};
