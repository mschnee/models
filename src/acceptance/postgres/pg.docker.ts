import { expect } from 'chai';
import { execSync } from 'child_process';
import * as path from 'path';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

let pgContainer: StartedTestContainer;
let mongoContainer: StartedTestContainer;

before(async function () {
  this.timeout(60 * 1000);
  pgContainer = await new GenericContainer('postgres')
    .withEnv('POSTGRES_USER', 'rds-test')
    .withEnv('POSTGRES_PASSWORD', 'asdfasdf')
    .withEnv('POSTGRES_DB', 'bambee-test')
    .withExposedPorts(5432)
    .start();

  mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start();

  // pg
  const pgPort = pgContainer.getMappedPort(5432).toString();
  const pgHost = pgContainer.getHost();
  expect(pgHost).to.be.string;
  expect(pgPort).to.be.string;
  process.env.TEST_RDS_URL = `postgres://rds-test:asdfasdf@${pgHost}:${pgPort}/bambee-test`;

  // mongo
  const mongoHost = mongoContainer.getHost();
  const mongoPort = mongoContainer.getMappedPort(27017).toString();
  expect(mongoHost).to.be.string;
  expect(mongoPort).to.be.string;
  process.env.TEST_MONGO_URL = `mongodb://${mongoHost}:${mongoPort}/bambee-test`;

  // setup
  execSync(`./bambee-typeorm.js migration:run`, {
    cwd: path.join(__dirname, '../../../'),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      RDS_SSL: 'false',
      RDS_URL: process.env.TEST_RDS_URL,
      MONGO_URL: process.env.TEST_MONGO_URL,
      SEED: 'true',
    },
  });
});

after(async function () {
  this.timeout(60 * 1000);
  if (pgContainer) {
    await pgContainer.stop();
  }
  if (mongoContainer) {
    await mongoContainer.stop();
  }
});
