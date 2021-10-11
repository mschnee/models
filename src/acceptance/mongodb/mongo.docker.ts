import { expect } from 'chai';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { withModelManager } from './with-model-manager';

let mongoContainer: StartedTestContainer;

async function startMongo() {
  if (process.env.TEST_MONGO_URL) {
    return;
  }
  mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start();

  const mongoHost = mongoContainer.getHost();
  const mongoPort = mongoContainer.getMappedPort(27017).toString();
  expect(mongoHost).to.be.string;
  expect(mongoPort).to.be.string;
  process.env.TEST_MONGO_URL = `mongodb://${mongoHost}:${mongoPort}/bambee-test`;
}

before(async function () {
  this.timeout(60 * 1000);
  await startMongo();
});

after(async function () {
  const [manager, closer] = await withModelManager();
  this.timeout(60 * 1000);
  if (closer) {
    await closer();
  }
  if (mongoContainer) {
    await mongoContainer.stop();
  }
});
