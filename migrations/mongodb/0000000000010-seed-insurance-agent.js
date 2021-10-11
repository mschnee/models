const connect = require('../lib/connect');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

module.exports.description = 'Adds default insurance agent, insurance1@bambee.com';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('0000000000010-seed-insurance-agent');
  const db = await connect();
  const company = await db.collection('companies').findOne({ name: 'Bambee' });
  const auth = await db.collection('auths').insertOne({
    username: 'insurance1@bambee.com',
    email: 'insurance1@bambee.com',
    password: '$2a$10$s3aHqijFqwr5aLazRdNSJuKJYzxN0jBU9F0IL4GL5i5zyKnxCU8HS', // asdfasdf
    oauth_identities: [
      {
        kind: 'google',
        tokens: {
          access_token:
            'ya29.GluTBuqcu69XoKZJUuo9SXs3MYIphDLxnqn75kyUgxCfWcbunthw4cENwuB-5TlmtogRpwHh8_VLhXVSTI7Fzzwpc92gT7Ok9CABfzxvHtxDgXrCuK4Q6lUeoaJE',
          refresh_token: '1/gcGd0lJDJtlxbqSgYqxIVg3aOft2zYoV2ckmZInA2ZY',
          token_type: 'Bearer',
          id_token:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4ZDMyNDVjNjJmODZiNjM2MmFmY2JiZmZlMWQwNjk4MjZkZDFkYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MTQ4NjY2Njc1NjktM2cydnMwazZ0b21tZmp1c2h2cTdyYWx2aHZhbmNocTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MTQ4NjY2Njc1NjktM2cydnMwazZ0b21tZmp1c2h2cTdyYWx2aHZhbmNocTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDExODM2NTg0OTQzOTgwODI2ODgiLCJoZCI6ImJhbWJlZS5jb20iLCJlbWFpbCI6InFhMkBiYW1iZWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJWS09sTWt2YTdnNjQ5YnRucFpxMjNnIiwibmFtZSI6IlFBIDIgUUEgMiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLXE2LU84VWVPV1pzL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FLeHJ3Y1pUWkdoV0IzbVl0NHBtY203dFVLNkN4dmIxNlEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlFBIDIiLCJmYW1pbHlfbmFtZSI6IlFBIDIiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU0NzY3MjcxOSwiZXhwIjoxNTQ3Njc2MzE5fQ.AMBupUsHu8udWaiA4kitDkC6j6cobXOfksGPaitpPeVFk9UCxdbg9moMU_1VlLoA-HETPVnSr_MRRuP4lHAao2_aKwpi_mi6ciEvZ_J_PucfjRgT2cGhWzQ3MEADSX3FnOE6zqHD24cJjymsv8AsIZuc4p03tSLOCORMkpakj3KydRYz2InoDYHj-AkAhLJ4IDM51F_sQI5MbORuEM6X5MCpIzTKnrU3vg64uJeEkfEYuPXZ0hOYf8YGMmCkng-vT-V43D4vwfMqh-TGNHhPpfebRRo7Ht_o-iB9iQb6rixxkqLxcoOgsyrUi-05vcIeaucWfBI7RfqHievmIvBVyQ',
          expiry_date: '2019-01-16T22:05:19.957Z',
        },
        profile: {
          id: '101183658494398082688',
          name: 'Insurance One',
          avatar_url:
            'https://lh4.googleusercontent.com/-q6-O8UeOWZs/AAAAAAAAAAI/AAAAAAAAAAA/AKxrwcZTZGhWB3mYt4pmcm7tUK6Cxvb16Q/mo/photo.jpg?sz=50',
          email: 'insurance1@bambee.com',
        },
      },
    ],
  });
  const user = await db.collection('users').insertOne({
    _company: company._id,
    _auth: auth.insertedId,
    role: 'insurance',
    profile: {
      first_name: 'Insurance',
      last_name: 'Agent1',
      phone: '13232139797',
    },
  });
  await db.collection('auths').updateOne({ _id: auth.insertedId }, { $set: { _user: user.insertedId } });
  await db.collection('configurations').insertOne({
    name: 'DefaultInsuranceAgent',
    kind: 'DefaultInsuranceAgent',
    officeHour: {
      availableDays: [0, 1, 2, 3, 4, 5, 6],
      start: '2019-01-16T16:00:00.000Z',
      duration: 10,
      interval: 30,
    },
    followUp: {
      postLimit: 3,
      preLimit: 3,
      wait: 15,
      lookAfterNoShow: 2880,
      lookAfter: 60,
      duration: 10,
    },
    _insuranceAgents: [user.insertedId],
  });
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }

  log('0000000000010-seed-insurance-agent');
  const db = await connect();
  const auth = await db.collection('auths').findOne({ email: 'insurance1@bambee.com' });
  if (auth) {
    await db.collection('auths').deleteOne({ _id: auth._id });
    await db.collection('users').deleteOne({ _auth: auth._id });
  }
  await db.collection('configurations').deleteOne({
    name: 'DefaultInsuranceAgent',
  });
};
