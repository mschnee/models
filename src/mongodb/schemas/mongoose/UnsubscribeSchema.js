const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unsubscribeSchema = new Schema({
  email: { type: String, default: '' },
  new_email: { type: String, default: '' },
  action: { type: String, enum: ['unsubscribe', 'update'] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = unsubscribeSchema;
