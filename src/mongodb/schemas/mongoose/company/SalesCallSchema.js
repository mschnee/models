const { Schema } = require('mongoose');

const noteSchema = require('./NoteSchema');

const salesCall = new Schema({
  // used for Calendly integration, so we can merge details from Calendly and apps
  _id: { type: String, required: true },

  _event: { type: Schema.Types.ObjectId, ref: 'CalendarEvent', default: null },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User' },

  kind: {
    type: String,
    enum: [
      'pre-overview-followup',
      'overview-call',
      'overview-call-attempt',
      'post-overview-followup',
      'essential-upgrade',
    ],
    required: true,
  },

  calendlyId: {
    type: String,
  },
  calendlyInviteeId: {
    type: String,
  },

  time: { type: Date },
  phone: {
    type: String,
    set: (val) => {
      if (!val) return;
      return val.replace(/[\s()-]/gi, '');
    },
    default: '',
  },

  status: {
    type: String,
    enum: ['answered', 'no-answer', 'canceled', null],
    default: null,
  },

  notes: [noteSchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

salesCall.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = salesCall;
