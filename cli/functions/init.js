const { exec } = require('child-process-promise');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const serverDir = path.join(__dirname, '..', '..', 'server');

const pullCmd = 'docker pull randomcontent/proxy-box';
const buildCmd = `docker build -t randomcontent/proxy-box ${serverDir}`;

async function pullImage(options) {
  const spinnerOpts = {
    ...options.spinner,
    text: 'Pulling proxy-box image from Docker Hub...'
  };

  const spinner = ora(spinnerOpts).start();

  try {
    const p = exec(pullCmd);
    if (options.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    spinner.warn('Unable to pull proxy-box image from Docker Hub');
    throw e;
  }

  spinner.succeed('proxy-box image successfully pulled!');
}

async function buildImage(options) {
  const spinnerOpts = {
    ...options.spinner,
    text: 'Building proxy-box image locally...'
  };

  const spinner = ora(spinnerOpts).start();

  try {
    const p = exec(buildCmd);
    if (options.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    await p;
  } catch (e) {
    spinner.fail('Unable to build local proxy-box image');
    console.error(`${chalk.red('Error:')} ${e.stderr}`);

    process.exit(1);
  }

  spinner.succeed('proxy-box image successfully built!');
}

async function init(argv) {
  const options = {
    debug: argv.debug,
    spinner: {
      isEnabled: !argv.debug
    }
  };

  if (argv.skipPull) {
    await buildImage(options);
  } else {
    try {
      await pullImage(options);
    } catch (e) {
      await buildImage(options);
    }
  }

  console.log(`Setup complete! Use ${chalk.cyan('pxbx create')} to start making proxy boxes`);
}

module.exports = init;
