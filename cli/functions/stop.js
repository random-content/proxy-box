const { exec } = require('child-process-promise');
const chalk = require('chalk');
const ora = require('ora');

async function stop(argv) {
  const cmd = `docker kill pxbx-${argv.name}`;

  const spinnerOpts = {
    isEnabled: !argv.debug,
    text: `Stopping ${argv.name}...`
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
    spinner.fail(`Unable to stop ${argv.name}`);
    let message;

    if (e.stderr.indexOf('No such container') > -1) {
      message = `No box named ${argv.name} to stop. Use ${chalk.cyan('pxbx ls')} to view available boxes`;
    } else if (e.stderr.indexOf('is not running') > 1) {
      message = `${argv.name} is not running`;
    } else {
      message = e.stderr;
    }

    console.error(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }

  spinner.succeed(`${argv.name} stopped.`);
}

module.exports = stop;
