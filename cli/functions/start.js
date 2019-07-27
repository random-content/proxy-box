const { exec } = require('child-process-promise');
const chalk = require('chalk');
const ora = require('ora');

async function start(argv) {
  const cmd = `docker start pxbx-${argv.name}`;

  const spinnerOpts = {
    isEnabled: !argv.debug,
    text: `Starting ${argv.name}...`
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
    spinner.fail(`Unable to start ${argv.name}`);
    const message = e.stderr.indexOf('No such container') > -1
      ? `No box named ${argv.name} to start. Use ${chalk.cyan('pxbx ls')} to view created boxes or ${chalk.cyan('pxbx create')} to make a new one`
      : e.stderr;

    console.error(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }

  spinner.succeed(`${argv.name} started!`);
}

module.exports = start;
