const connect = require('../lib/connect');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

module.exports.description = 'Adds default sales user, qa1@bambee.com';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Running 0000000000003-seed-hr');
  const db = await connect();

  const company = await db.collection('companies').findOne({ name: 'Bambee' });
  const auth = await db.collection('auths').insertOne({
    username: 'qa1@bambee.com',
    email: 'qa1@bambee.com',
    password: '$2a$10$s3aHqijFqwr5aLazRdNSJuKJYzxN0jBU9F0IL4GL5i5zyKnxCU8HS', // asdfasdf
    oauth_identities: [
      {
        kind: 'google',
        tokens: {
          access_token:
            'ya29.GluTBqG720hMSvA8ghEgOeKYp6RP0UEqHW0b6fXdycWGaINjT9dksI3OdBYUSria7P_oYya7lfVKv1g1SqVpZs4WZWy6GYML90rifJBya6q-u-WzsPYCWtke9dc7',
          refresh_token: '1/kcihTAKeLZKnftiaNuyQcPdu9K-WcQb4e29-pVl-olQ',
          token_type: 'Bearer',
          id_token:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4ZDMyNDVjNjJmODZiNjM2MmFmY2JiZmZlMWQwNjk4MjZkZDFkYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MTQ4NjY2Njc1NjktM2cydnMwazZ0b21tZmp1c2h2cTdyYWx2aHZhbmNocTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MTQ4NjY2Njc1NjktM2cydnMwazZ0b21tZmp1c2h2cTdyYWx2aHZhbmNocTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE2NTA2MTY3NzYzOTAyMDY5OTgiLCJoZCI6ImJhbWJlZS5jb20iLCJlbWFpbCI6InFhMUBiYW1iZWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJPVTRYaFJkTEJ3clFocF8yQ3F0aEp3IiwibmFtZSI6IlFBIDEgUUEgMSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLURPVmwzU1hiOGxNL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FLeHJ3Y1pQZnNKUm1IU3haeC1ORTlBa3FDaTgyYTVtN1Evczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlFBIDEiLCJmYW1pbHlfbmFtZSI6IlFBIDEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU0NzY3Mjc3NSwiZXhwIjoxNTQ3Njc2Mzc1fQ.KCWG7PNQnYxTUhZml9BPCrq8fVB6qAuRY2liVIc-IZl3eKmxxElAoHrQzBneoe8Gfsgd5ape31mFef7pEaVOOpimLbheIfzqzOdsXsw61rVshS8tfgHZnG-9VJkQR0PZgjFULWfkZJRrxl-OPHnIVXVMzTm-0YjeG0Oh7u4X3qS3VPZz_d0EnCVQizijyUzgetdn045G_1SVh4wHCIy6GuVD2YHy6KpDvtzq0U-ISmx6OkEt3uAeAyRYauxVyWUixQVYlERtpkzRfU_FzuE0h8BRocNsH4odWmBjGS5A6mN6yivsWeK4zdKsC40oUaPZ7wtawYfJpfFSI_NOv9cI8A',
          expiry_date: '2019-01-16T22:06:15.911Z',
        },
        profile: {
          id: '101650616776390206998',
          name: 'QA 1 QA 1',
          avatar_url:
            'https://lh3.googleusercontent.com/-DOVl3SXb8lM/AAAAAAAAAAI/AAAAAAAAAAA/AKxrwcZPfsJRmHSxZx-NE9AkqCi82a5m7Q/mo/photo.jpg?sz=50',
          email: 'qa1@bambee.com',
        },
      },
    ],
  });
  const user = await db.collection('users').insertOne({
    _company: company._id,
    _auth: auth.insertedId,
    role: 'sales',
    profile: {
      first_name: 'admin',
      last_name: 'sales',
      phone: '13232139797',
    },
    settings: {
      calendar_channel: '5c3fac8a2820840030d8111c',
    },
  });
  await db.collection('auths').updateOne({ _id: auth.insertedId }, { $set: { _user: user.insertedId } });
  await db.collection('configurations').insertOne({
    name: 'DefaultAdvisor',
    kind: 'DefaultAdvisor',
    _advisor: user.insertedId,
  });
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }

  log('Reverting 0000000000003-seed-hr');
  const db = await connect();
  const auth = await db.collection('auths').findOne({ email: 'qa2@bambee.com' });
  if (auth) {
    await db.collection('auths').deleteOne({ _id: auth._id });
    await db.collection('users').deleteOne({ _auth: auth._id });
  }
  await db.collection('configurations').deleteOne({
    name: 'DefaultAdvisor',
  });
};
