const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumableTokenSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'Auth' },
  _created_by: { type: Schema.Types.ObjectId, ref: 'Auth' },

  token: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: null },
  consumed_at: { type: Date, default: null },
});

module.exports = consumableTokenSchema;
