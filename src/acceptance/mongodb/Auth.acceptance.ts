import { expect } from 'chai';
import * as faker from 'faker';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Company', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Auth can be instantiated', async () => {
    expect(() => {
      new manager.Auth();
    }).not.to.throw;
  });

  it('Accepting TOS sets tosAcceptedAt on creation', async () => {
    const email = faker.internet.email();
    const authData = {
      email,
      username: email,
      TOSAccepted: true,
    };

    const auth = new manager.Auth(authData);
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).not.to.be.null;
    expect(auth.tosAcceptedAt).to.be.instanceOf(Date);
  });

  it('Accepting TOS sets tosAcceptedAt on set', async () => {
    const email = faker.internet.email();
    const authData = {
      email,
      username: email,
    };

    const auth = new manager.Auth(authData);
    expect(auth.TOSAccepted).to.be.false;
    expect(auth.tosAcceptedAt).to.be.null;

    auth.TOSAccepted = true;
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).not.to.be.null;
    expect(auth.tosAcceptedAt).to.be.instanceOf(Date);
  });

  it('Accepting TOS sets tosAcceptedAt on set should not double-set', async () => {
    const email = faker.internet.email();
    const authData = {
      email,
      username: email,
    };

    const auth = new manager.Auth(authData);
    expect(auth.TOSAccepted).to.be.false;
    expect(auth.tosAcceptedAt).to.be.null;

    auth.TOSAccepted = true;
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).not.to.be.null;
    expect(auth.tosAcceptedAt).to.be.instanceOf(Date);
    const firstDate = auth.tosAcceptedAt;

    auth.TOSAccepted = false;
    auth.TOSAccepted = true;
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).not.to.be.null;
    expect(auth.tosAcceptedAt).to.be.instanceOf(Date);
    expect(auth.tosAcceptedAt).to.equal(firstDate);
  });

  it('An existing auth with an existing TOSAccepted should not update', async () => {
    const email = faker.internet.email();
    const { insertedId } = await manager.Auth.db.collection('auths').insertOne({
      email,
      username: email,
      TOSAccepted: true,
    });

    const auth = await manager.Auth.findById(insertedId);
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).to.be.null;

    auth.TOSAccepted = true;
    expect(auth.TOSAccepted).to.be.true;
    expect(auth.tosAcceptedAt).to.be.null;
  });
});
