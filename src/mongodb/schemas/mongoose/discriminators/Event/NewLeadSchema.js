const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newLeadSchema = new Schema({
  data: {
    marketing: {
      http_referer: { type: String, default: '' },
      query_params: { type: Schema.Types.Mixed, default: {} },
    },
  },
});

module.exports = newLeadSchema;
