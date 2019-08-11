#!/usr/bin/env node

const yargs = require('yargs');

const initCmd = require('./commands/init');
const createCmd = require('./commands/create');
const startCmd = require('./commands/start');
const stopCmd = require('./commands/stop');
const lsCmd = require('./commands/ls');
const rmCmd = require('./commands/rm');
const logsCmd = require('./commands/logs');
const restartCmd = require('./commands/restart');

const init = require('./functions/init');
const create = require('./functions/create');
const start = require('./functions/start');
const stop = require('./functions/stop');
const ls = require('./functions/ls');
const rm = require('./functions/rm');
const logs = require('./functions/logs');
const restart = require('./functions/restart');

yargs.version()
  .help()
  .option('debug', {
    describe: 'Enable debug output',
    boolean: true
  });

yargs.command(initCmd)
  .command(createCmd)
  .command(startCmd)
  .command(stopCmd)
  .command(lsCmd)
  .command(rmCmd)
  .command(logsCmd)
  .command(restartCmd);

yargs.demandCommand(1, 1, 'One of the commands listed above is required', 'Select a single command')
  .strict(true);


async function run() {
  const { argv } = yargs;

  const command = argv._[0];

  switch (command) {
    case 'init':
      await init(argv);
      break;
    case 'create':
      await create(argv);
      break;
    case 'start':
      await start(argv);
      break;
    case 'stop':
      await stop(argv);
      break;
    case 'ls':
      await ls(argv);
      break;
    case 'rm':
      await rm(argv);
      break;
    case 'logs':
      await logs(argv);
      break;
    case 'restart':
      await restart(argv);
      break;
    default:
      if (argv.debug) {
        console.log(argv);
      }
      break;
  }
}

run();
