require('dotenv').config();
const chalk = require('chalk');
const path = require('path');
const prompts = require('prompts');
const findNodeBin = require('./find-node-bin');
const { execSync } = require('child_process');

module.exports = async function (upOrDown) {
  if (!process.env.MONGO_URL) {
    console.log(chalk.redBright('process.env.MONGO_URL is not set'));
    process.exit(-1);
  }

  const command = findNodeBin('migrate');
  const args = [
    '--migrations-dir',
    path.resolve(__dirname, '../../migrations/mongodb'),
    '--store',
    path.resolve(__dirname, '../../bin/MongoMigrationStore'),
  ];
  if (Array.isArray(upOrDown)) {
    args.push(...upOrDown);
  } else {
    args.push(upOrDown);
  }

  function doMigrate() {
    console.log(chalk.blueBright('MONGO_URL'), chalk.greenBright(process.env.MONGO_URL));
    console.log(chalk.blueBright('RDS_URL'), chalk.greenBright(process.env.RDS_URL));
    /* const subprocess = */ execSync(`${command} ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../..'),
    });
    // subprocess.on('error', error => {
    //   console.error(error)
    // });
    // subprocess.stdout.on('data', d => {
    //   process.stdout.write(d);
    // })
    // subprocess.on('exit', code => {
    //   console.log('oexistver"')
    //   process.exit(code)
    // })

    // subprocess.on('close', code => {
    //   console.log('close"')
    //   process.exit(code)
    // })
  }

  const checkUrl = new URL(process.env.RDS_URL);
  if (checkUrl.pathname === '/bambee') {
    console.log(chalk.redBright('You appear to be connecting to a production database!'));
    const response = await prompts([
      {
        type: 'confirm',
        name: 'runProduction',
        message: 'Are you sure you want to continue?',
        initial: false,
      },
    ]);
    if (!response.runProduction) {
      console.log(chalk.yellow('Okay, not doing anything.'));
      process.exit(0);
    } else {
      doMigrate();
      process.exit(0);
    }
  } else {
    doMigrate();
    process.exit(0);
  }
};
