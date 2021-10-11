require('dotenv').config();
const chalk = require('chalk');
const path = require('path');
const prompts = require('prompts');
const findNodeBin = require('./find-node-bin');
const { execSync } = require('child_process');

module.exports = async function runTypeorm(args) {
  if (!process.env.RDS_URL) {
    console.log(chalk.redBright('process.env.RDS_URL is not set'));
    process.exit(-1);
  }

  if (!process.env.MONGO_URL) {
    console.log(chalk.redBright('process.env.MONGO_URL is not set'));
    process.exit(-1);
  }

  function doMigrate() {
    try {
      console.log(chalk.blueBright('MONGO_URL'), chalk.greenBright(process.env.MONGO_URL));
      console.log(chalk.blueBright('RDS_URL'), chalk.greenBright(process.env.RDS_URL));

      const command = findNodeBin('typeorm');
      execSync(`${command} ${args.join(' ')}`, {
        cwd: path.resolve(__dirname, '../..'),
        stdio: 'inherit',
      });
      return 0;
    } catch (e) {
      return e.status;
    }
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
      process.exit(doMigrate());
    }
  } else {
    process.exit(doMigrate());
  }
};
