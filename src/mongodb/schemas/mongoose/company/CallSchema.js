const { Schema } = require('mongoose');

const noteSchema = require('./NoteSchema');

const Call = new Schema({
  // used for Calendly integration, so we can merge details from Calendly and apps
  _id: { type: String, required: true },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  _invitee: { type: Schema.Types.ObjectId, ref: 'User' },
  _host: { type: Schema.Types.ObjectId, ref: 'User' },

  _inviteeEmail: { type: String },

  kind: {
    type: String,
    enum: ['hr-transition-intro'],
    required: true,
  },

  calendlyId: {
    type: String,
  },
  calendlyInviteeId: {
    type: String,
  },

  time: { type: Date },

  disposition: {
    type: String,
    enum: ['completed', 'missed', 'canceled', 'rescheduled', null],
    default: null,
  },

  notes: [noteSchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

Call.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = Call;
