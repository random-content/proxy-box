const { exec } = require('child-process-promise');
const chalk = require('chalk');
const ora = require('ora');

async function stop(argv) {
  const stopCmd = `docker kill pxbx-${argv.name}`;
  const startCmd = `docker start pxbx-${argv.name}`;

  const spinnerOpts = {
    isEnabled: !argv.debug,
    text: `Restarting ${argv.name}...`
  };

  const spinner = ora(spinnerOpts).start();

  try {
    const p = exec(stopCmd);
    if (argv.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    spinner.fail(`Unable to stop ${argv.name}`);
    let message;

    if (e.stderr.indexOf('No such container') > -1) {
      message = `No box named ${argv.name} to restart. Use ${chalk.cyan('pxbx ls')} to view available boxes`;
    } else if (e.stderr.indexOf('is not running') > 1) {
      message = `${argv.name} is not running`;
    } else {
      message = e.stderr;
    }

    console.error(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }

  try {
    const p = exec(startCmd);
    if (argv.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    spinner.fail(`Unable to start ${argv.name}`);
    console.error(`${chalk.red('Error:')} ${e.stderr}`);

    process.exit(1);
  }

  spinner.succeed(`${argv.name} restarted!`);
}

module.exports = stop;
