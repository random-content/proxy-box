const { exec } = require('child-process-promise');
const chalk = require('chalk');
const ora = require('ora');

async function rm(argv) {
  const cmd = `docker rm ${argv.force ? '-f' : ''} pxbx-${argv.name}`;

  const spinnerOpts = {
    isEnabled: !argv.debug,
    text: `Removing ${argv.name}...`
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
    spinner.fail(`Unable to remove ${argv.name}`);

    let message;
    if (e.stderr.indexOf('No such container') > -1) {
      message = `No box named ${argv.name} to removed. Use ${chalk.cyan('pxbx ls')} to view available boxes`;
    } else if (e.stderr.indexOf('running container') > 1) {
      message = `${argv.name} is running and can't be removed. To remove it, either stop it first with ${chalk.cyan(`pxbx stop ${argv.name}`)} or force remove it with ${chalk.cyan(`pxbx rm -f ${argv.name}`)}`;
    } else {
      message = e.stderr;
    }

    console.error(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }

  spinner.succeed(`${argv.name} removed.`);
}

module.exports = rm;
