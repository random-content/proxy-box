const { exec } = require('child-process-promise');
const chalk = require('chalk');

async function logs(argv) {
  const cmd = `docker logs ${argv.follow ? '-f' : ''} pxbx-${argv.name}`;

  try {
    const p = exec(cmd);
    p.childProcess.stdout.pipe(process.stdout);

    if (argv.debug) {
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    let message;
    if (e.stderr.indexOf('No such container') > -1) {
      message = `No box named ${argv.name} to view logs for. Use ${chalk.cyan('pxbx ls')} to view available boxes`;
    } else {
      message = e.stderr;
    }

    console.error(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }
}

module.exports = logs;
