#!/usr/bin/env node
const splitIndex = process.argv.findIndex((v) => {
  return v.includes('bambee-typeorm');
});
const runTypeorm = require('./bin/lib/run-typeorm');

const args = process.argv.slice(splitIndex + 1);
runTypeorm(args)
  .then(() => {
    // noop
  })
  .catch((e) => {
    console.error(e);
    throw e;
  });
