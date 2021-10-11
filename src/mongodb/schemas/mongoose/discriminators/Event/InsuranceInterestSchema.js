const { Schema } = require('mongoose');

const insuranceInterestSchema = new Schema({
  data: {
    interested: { type: Boolean, default: true },
    source: { type: String, default: '' },
  },
});

module.exports = insuranceInterestSchema;
