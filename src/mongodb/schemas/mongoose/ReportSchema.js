const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    name: { type: String, index: true },
    created_at: { type: Date, default: Date.now, index: true },
  },
  {
    discriminatorKey: 'kind',
  },
);

reportSchema.index({
  kind: 1,
});

reportSchema.index({
  kind: 1,
  created_at: 1,
});

module.exports = reportSchema;
