const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const googleWatchChannelSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'Auth' },
  calendarId: { type: String },
  resourceType: { type: String, enum: ['calendar'], default: 'calendar' },
  resourceId: { type: String },
  token: { type: String },
  address: { type: String },

  active: { type: Boolean, default: false },

  expiration: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = googleWatchChannelSchema;
