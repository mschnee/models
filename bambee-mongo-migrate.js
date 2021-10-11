#!/usr/bin/env node
const migration = require('./bin/lib/mongo-migrate');

const splitIndex = process.argv.findIndex((v) => {
  return v.includes('bambee-mongo-migrate');
});

const args = process.argv.slice(splitIndex + 1);
migration(args)
  .then(() => {
    // noop
  })
  .catch((e) => {
    console.error(e.message);
    throw e;
  });
