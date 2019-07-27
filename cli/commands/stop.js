function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to stop',
    type: 'string'
  })
    .option('version', {
      hidden: true
    });

  return yargs;
}

module.exports = {
  command: 'stop <name>',
  describe: 'Stop a proxy-box instance',
  builder
};
