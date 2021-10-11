const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signatureSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  input: { type: String, required: true }, //typed in value

  logged_in: {
    timestamp: { type: Date, required: true },
    ip_address: { type: String, required: true },
  },

  created_at: { type: Date, default: Date.now },
});

module.exports = signatureSchema;
