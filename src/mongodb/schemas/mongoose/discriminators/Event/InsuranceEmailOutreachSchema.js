const { Schema } = require('mongoose');

const insuranceEmailOutreach = new Schema({
  data: {
    source: { type: String, default: '' },
  },
});

module.exports = insuranceEmailOutreach;
