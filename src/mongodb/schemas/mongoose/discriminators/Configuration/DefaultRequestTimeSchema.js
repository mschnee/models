const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultRequestTimeSchema = new Schema({
  expectedTime: [
    {
      name: { type: String, default: '' },
      time: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  ],
});

module.exports = defaultRequestTimeSchema;
