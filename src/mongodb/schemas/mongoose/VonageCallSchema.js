const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vonageCallSchema = new Schema({
  charge: { type: Number, default: 0 },
  custom_tag: { type: String, default: null },
  destination_device_name: { type: String, default: null },
  destination_extension: { type: String, default: null },
  destination_sip_id: { type: String, default: null },
  destination_user: { type: String, default: null },
  destination_user_full_name: { type: String, default: null },
  direction: { type: String, default: null },
  end: { type: Date, default: Date.now() },
  from: { type: String, default: null },
  id: { type: String, default: '' },
  in_network: { type: Boolean, default: false },
  international: { type: Boolean, default: false },
  length: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  recorded: { type: Boolean, default: false },
  result: { type: String, default: null },
  source_device_name: { type: String, default: null },
  source_extension: { type: String, default: null },
  source_sip_id: { type: String, default: null },
  source_user: { type: String, default: null },
  source_user_full_name: { type: String, default: null },
  start: { type: Date, default: Date.now() },
  to: { type: String, default: null },

  _customerUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  _bambeeUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

vonageCallSchema.index({ id: 1, start: 1, end: 1 }, { unique: true });

module.exports = vonageCallSchema;
