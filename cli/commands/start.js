function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to start',
    type: 'string'
  })
    .option('version', {
      hidden: true
    });

  return yargs;
}

module.exports = {
  command: 'start <name>',
  describe: 'Start a proxy-box instance',
  builder
};
