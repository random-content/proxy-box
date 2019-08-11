function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to restart',
    type: 'string'
  })
    .option('version', {
      hidden: true
    });

  return yargs;
}

module.exports = {
  command: 'restart <name>',
  describe: 'Restart a proxy-box instance',
  builder
};
