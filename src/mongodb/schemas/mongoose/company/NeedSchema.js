const { Schema } = require('mongoose');

const needSchema = new Schema({
  value: { type: String, default: '' },
  name: { type: String, default: '' },
});

module.exports = needSchema;
