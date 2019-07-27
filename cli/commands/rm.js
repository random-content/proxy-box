function builder(yargs) {
  yargs.positional('name', {
    describe: 'The name of the proxy-box instance to remove',
    type: 'string'
  })
    .option('force', {
      alias: 'f',
      boolean: true,
      describe: 'Force removal (if running)'
    })
    .option('version', {
      hidden: true
    });
}

module.exports = {
  command: 'rm <name>',
  describe: 'Remove a proxy-box instance',
  builder
};
