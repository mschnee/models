const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');
const connect = require('../lib/connect');

module.exports.description = "Adds type to document templates, and defaults to 'bambee'";

module.exports.up = async function () {
  let ucounter = 0;
  async function createHoneyUser(email, role) {
    ucounter++;
    const company = await db.collection('companies').findOne({ name: 'Bambee' });
    const auth = await db.collection('auths').insertOne({
      username: email,
      email,
      password: '$2a$10$s3aHqijFqwr5aLazRdNSJuKJYzxN0jBU9F0IL4GL5i5zyKnxCU8HS', // asdfasdf
      oauth_identities: [
        {
          kind: 'google',
          tokens: { id_token: 'id-token-asdf' },
          profile: { email, id: `asdf-${ucounter}` },
        },
      ],
    });
    const user = await db.collection('users').insertOne({
      _auth: auth.insertedId,
      _company: company._id,
      role,
      profile: {
        first_name: `user-${ucounter}`,
        last_name: 'test',
      },
    });

    await db.collection('auths').updateOne({ _id: auth.insertedId }, { $set: { _user: user.insertedId } });

    return user;
  }

  if (process.env.NODE_ENV !== 'test' || process.env.SEED !== 'true') {
    return;
  }

  log('Running 0000000000008-test-seed-data');
  const db = await connect();

  // re-hire global templates
  const templates = [];
  for (let i = 0; i < 2; i++) {
    const content = `Document for re-hiring employees after covid-19. Version ${i}`;
    templates.push({
      name: `Re-hire ${i}`,
      delta: [content],
      html: `<div>${content}</div>`,
      icon: '/assets/images/policy-icons/icon3.svg',
      description:
        'Lorem ipsum dolor sit amet, ei diam fuisset praesent mea. An has harum primis, pri equidem tibique corpora ex. Per consul principes no, ne malis intellegat sea. Mea tritani legimus no, duo paulo voluptua id. At eum eros maiestatis.',
      status: 'created',
    });
  }
  log('Seeding re-hire global templates');
  const templatesResult = await db.collection('documenttemplates').insertMany(templates);
  await db.collection('configurations').insertOne({
    name: 'Rehire',
    kind: 'Rehire',
    templates: Object.values(templatesResult.insertedIds),
  });

  const hr1 = await createHoneyUser('hr1@bambee.com', 'admin');
  const hr2 = await createHoneyUser('hr2@bambee.com', 'admin');
  await createHoneyUser('hr3@bambee.com', 'admin');

  /* const sales1 = */ await createHoneyUser('sales1@bambee.com', 'admin');
  await createHoneyUser('sales2@bambee.com', 'admin');
  await createHoneyUser('sales3@bambee.com', 'admin');
  await createHoneyUser('sales4@bambee.com', 'admin');

  await db.collection('configurations').insertOne({
    name: 'DefaultOnboarding',
    kind: 'DefaultOnboarding',
    _coordinators: [
      {
        _user: hr1.insertedId,
        lastAssignment: Date.now(),
      },
      {
        _user: hr2.insertedId,
        lastAssignment: Date.now(),
      },
    ], // Leave hr3 out of round-robin
  });
};

module.exports.down = async function () {
  log('Reverting 0000000000008-test-seed-data');
  async function deleteByEmail(email) {
    const auth = await db.collection('auths').findOne({ email });
    if (auth) {
      await db.collection('auths').deleteOne({ _id: auth._id });
      await db.collection('users').deleteOne({ _auth: auth._id });
    }
  }
  if (process.env.NODE_ENV !== 'test' || process.env.SEED !== 'true') {
    return;
  }
  const db = await connect();
  await deleteByEmail('hr1@bambee.com');
  await deleteByEmail('hr2@bambee.com');
  await deleteByEmail('hr3@bambee.com');

  await deleteByEmail('sales1@bambee.com');
  await deleteByEmail('sales2@bambee.com');
  await deleteByEmail('sales3@bambee.com');
  await deleteByEmail('sales4@bambee.com');
};
