const { exec } = require('child-process-promise');
const _ = require('lodash');
const ora = require('ora');
const chalk = require('chalk');

function portDefined(port) {
  return !_.isNil(port) && !_.isNaN(port);
}

async function create(argv) {
  const httpMapping = portDefined(argv.http) ? `-p ${argv.http}:${argv.http}` : '';
  const httpArg = portDefined(argv.http) ? `--http ${argv.http}` : '';
  const httpsMapping = portDefined(argv.https) ? `-p ${argv.https}:${argv.https}` : '';
  const httpsArg = portDefined(argv.https) ? `--https ${argv.https}` : '';
  const corsArg = argv.cors ? '--cors true' : '';

  const cmd = `docker create ${httpMapping} ${httpsMapping} --name pxbx-${argv.name} randomcontent/proxy-box index.js --target ${argv.target} ${httpArg} ${httpsArg} ${corsArg}`;

  const spinnerOpts = {
    isEnabled: !argv.debug,
    text: `Creating ${argv.name} box...`
  };

  const spinner = ora(spinnerOpts).start();

  try {
    const p = exec(cmd);
    if (argv.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    spinner.fail(`Unable to create ${argv.name} box`);
    console.error(`${chalk.red('Error:')} ${e.stderr}`);

    process.exit(1);
  }

  spinner.succeed(`${argv.name} created! Use ${chalk.cyan(`pxbx start ${argv.name}`)} to start it up`);
}

module.exports = create;
