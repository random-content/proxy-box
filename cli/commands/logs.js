function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to view logs from',
    type: 'string'
  })
    .option('follow', {
      alias: 'f',
      boolean: true,
      describe: 'Tail the logs'
    })
    .option('version', {
      hidden: true
    });
}

module.exports = {
  command: 'logs <name>',
  describe: 'View logs from a proxy-box instance',
  builder
};
