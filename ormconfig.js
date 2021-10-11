require('dotenv').config();

const fs = require('fs');
const path = require('path');

if (!process.env.RDS_URL) {
  throw new Error('Cannot run or create migrations with a read-write connection via process.env.RDS_URL');
}

const migrations = ['dist/postgres/migrations/*.js'];
if (process.env.SEED === 'true') {
  migrations.unshift('dist/postgres/seeds/*.js');
}

const config = {
  type: 'postgres',
  url: process.env.RDS_URL,
  entities: [path.join(__dirname, 'dist/postgres/entities/*.entity.js')],
  migrations,
  logging: true,
  cli: {
    entitiesDir: path.join(__dirname, 'src/postgres/entities'),
    migrationsDir: path.join(__dirname, 'src/postgres/migrations'),
  },
};

if (process.env.RDS_SSL === 'allow-unauthorized') {
  config.ssl = {
    rejectUnauthorized: false,
  };
} else if (process.env.RDS_SSL === 'false') {
  // noop, don't use ssl
  delete config.ssl;
} else {
  config.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, './ssl/rds-combined-ca-bundle.pem')).toString(),
  };
}

module.exports = config;
