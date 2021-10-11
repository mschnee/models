const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configurationSchema = new Schema(
  {
    name: { type: String, unique: true, required: true, trim: true, index: true },
  },
  {
    discriminatorKey: 'kind',
  },
);

module.exports = configurationSchema;
