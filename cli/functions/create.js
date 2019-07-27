const { exec } = require('child-process-promise');
const _ = require('lodash');
const ifaces = require('os').networkInterfaces();
const ora = require('ora');
const chalk = require('chalk');

function replaceHostname(url, hostname) {
  let newUrl = url;
  Object.keys(ifaces).forEach((dev) => {
    const iface = ifaces[dev];
    iface.forEach((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        newUrl = url.replace(hostname, details.address);
      }
    });
  });

  return newUrl;
}

function portDefined(port) {
  return !_.isNil(port) && !_.isNaN(port);
}

async function create(argv) {
  let { target } = argv;
  if (target.includes('localhost')) {
    target = replaceHostname(target, 'localhost');
  } else if (target.includes('127.0.0.1')) {
    target = replaceHostname(target, '127.0.0.1');
  } else if (target.includes('0.0.0.0')) {
    target = replaceHostname(target, '0.0.0.0');
  }

  const httpMapping = portDefined(argv.http) ? `-p ${argv.http}:${argv.http}` : '';
  const httpArg = portDefined(argv.http) ? `--http ${argv.http}` : '';
  const httpsMapping = portDefined(argv.https) ? `-p ${argv.https}:${argv.https}` : '';
  const httpsArg = portDefined(argv.https) ? `--https ${argv.https}` : '';
  const corsArg = argv.cors ? '--cors true' : '';

  const cmd = `docker create ${httpMapping} ${httpsMapping} --name pxbx-${argv.name} randomcontent/proxy-box index.js --target ${target} ${httpArg} ${httpsArg} ${corsArg}`;

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
