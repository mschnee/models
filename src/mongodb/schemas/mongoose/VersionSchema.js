const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const versionSchema = new Schema({
  value: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
});

module.exports = versionSchema;
