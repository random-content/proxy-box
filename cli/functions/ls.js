const { exec } = require('child-process-promise');
const chalk = require('chalk');
const Table = require('cli-table');

const cmd = 'docker ps -a --no-trunc --format "{{.Names}}::{{.Status}}::{{.Command}}" | grep pxbx-';

const tableHeaders = ['Name', 'Status', 'Target', 'HTTP', 'HTTPS', 'CORS'];
const tableOptions = {
  head: tableHeaders.map((header) => chalk.cyan(header))
};

async function ls(argv) {
  let result;
  try {
    const p = exec(cmd);

    if (argv.debug) {
      p.childProcess.stdout.pipe(process.stdout);
      p.childProcess.stderr.pipe(process.stderr);
    }

    result = await p;
  } catch (e) {
    if (!e.stderr) { // probably just means no results
      console.log(`No instances to show. Use ${chalk.cyan('pxbx create')} to make some instances`);
      process.exit();
    } else {
      console.error(`${chalk.red('Error:')} ${e.stderr}`);
      process.exit(1);
    }
  }

  const lines = result.stdout.split('\n');
  const table = new Table(tableOptions);

  lines.forEach((line) => {
    const row = [];
    const fields = line.split('::');
    if (fields.length !== 3) {
      return;
    }

    const [name, status, command] = fields;
    const args = command.split(' ');

    row.push(name.substring(5));
    row.push(status.indexOf('Up ') > -1 ? 'Running' : 'Stopped');

    const targetArgIndex = args.indexOf('--target');
    row.push(args[targetArgIndex + 1]);

    const httpArgIndex = args.indexOf('--http');
    row.push(httpArgIndex > -1 ? args[httpArgIndex + 1].substring(0, 4) : '');

    const httpsArgIndex = args.indexOf('--https');
    row.push(httpsArgIndex > -1 ? args[httpsArgIndex + 1].substring(0, 4) : '');

    const hasCorsArg = args.indexOf('--cors') > -1;
    row.push(hasCorsArg ? 'Enabled' : 'Disabled');

    table.push(row);
  });

  console.log(table.toString());
}

module.exports = ls;
