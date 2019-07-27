const builder = {
  'skip-pull': {
    boolean: true,
    describe: 'Skip pulling the proxy-box image and build it locally'
  },
  version: {
    hidden: true
  }
};

module.exports = {
  command: 'init',
  describe: 'Initialize the proxy-box image',
  builder
};
