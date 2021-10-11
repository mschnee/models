/**
 * This applies to both development seeds, and test seeds
 */
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

const connect = require('../lib/connect');

module.exports.description = 'Seeds the god user for dev/test';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }

  log('Running 0000000000001-seed');
  const db = await connect();

  // create the god user and company
  log('Creating god@bambee.com');
  const auth = await db.collection('auths').insertOne({
    username: 'god@bambee.com',
    email: 'god@bambee.com',
    password: '$2a$10$s3aHqijFqwr5aLazRdNSJuKJYzxN0jBU9F0IL4GL5i5zyKnxCU8HS', // asdfasdf
    active: true,
  });

  const company = await db.collection('companies').insertOne({
    name: 'Bambee',
    status: 'paying',
    profile: {
      industry: 'HR',
      address: '304 South Broadway',
      address2: 'Suite 300',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90006',
    },
  });

  const user = await db.collection('users').insertOne({
    _auth: auth.insertedId,
    _company: company.insertedId,
    role: 'admin',
    profile: {
      first_name: 'admin',
      last_name: 'test',
    },
    permissions: {
      canEditGlobalPolicies: true,
    },
  });
  await db.collection('auths').updateOne({ _id: auth.insertedId }, { $set: { _user: user.insertedId } });

  // create the system user
  log('Creating System User (honey@bambee.com)');
  const systemAuth = await db.collection('auths').insertOne({
    username: 'honey@bambee.com',
    email: 'honey@bambee.com',
    password: '$2a$10$s3aHqijFqwr5aLazRdNSJuKJYzxN0jBU9F0IL4GL5i5zyKnxCU8HS', // asdfasdf
  });
  const systemUser = await db.collection('users').insertOne({
    _auth: systemAuth.insertedId,
    _company: company.insertedId,
    role: 'default',
    profile: {
      first_name: 'Honey',
      last_name: 'System',
    },
  });
  await db.collection('auths').updateOne({ _id: systemAuth.insertedId }, { $set: { _user: systemUser.insertedId } });
  await db.collection('configurations').insertOne({
    name: 'System',
    kind: 'System',
    _user: systemUser.insertedId,
  });

  // Pandadoc config
  await db.collection('configurations').insertOne({
    name: 'PandaDoc',
    kind: 'PandaDoc',
    _primaryOauthUser: auth.insertedId,
    globalTemplatesFolder: 'AdaiNQkKupjWwGWJ92XdVe',
    globalStandardTemplatesFolder: 'AoS6dXjfqpSnt4oBWruLTe',
    companiesTemplateFolder: 'khy4XSzjxbwdckXqYWX9vU',
    companiesDocumentFolder: '9CRB6RaF7Xg4y6V8pnwhSY',
    tokens: {
      token_type: 'Bearer',
      access_token: '96a727a70a1232d35ba8e0bc411628bdef313e18',
      refresh_token: 'f5f1c33365c3a2412356f9cb7d3298e30d721505',
    },
  });

  log('some auths and users should exist');
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  const db = await connect();
  await db.collection('users').deleteMany({});
  await db.collection('company').deleteMany({});
  await db.collection('auth').deleteMany({});
};
