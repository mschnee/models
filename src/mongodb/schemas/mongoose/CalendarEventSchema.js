const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarEventSchema = new Schema(
  {
    _user: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    _channel_id: { type: Schema.Types.ObjectId, ref: 'GoogleWatchChannel' },
    _customer: { type: Schema.Types.ObjectId, ref: 'User' },
    _bambee_user: { type: Schema.Types.ObjectId, ref: 'User' },
    _ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', default: null },

    gcal_event_id: { type: String, default: '', index: true },
    zendesk_id: { type: String, default: '' },

    //status: {type: String, default: ''},
    /*etag: {type: String, default: ''},
  htmlLink: {type: String, default: ''},
  start: {type: Date, default: ''},
  end: {type: Date, default: ''},*/
    phone: { type: String, default: '' },
    active: { type: Boolean, default: true },

    gcal_data: { type: Schema.Types.Mixed, default: null }, //response data from google

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

calendarEventSchema.virtual('status').get(function () {
  return this.gcal_data ? this.gcal_data.status : null;
});

calendarEventSchema.virtual('etag').get(function () {
  return this.gcal_data ? this.gcal_data.etag : null;
});

calendarEventSchema.virtual('start').get(function () {
  return this.gcal_data ? this.gcal_data.start.dateTime : null;
});

calendarEventSchema.virtual('end').get(function () {
  return this.gcal_data ? this.gcal_data.end.dateTime : null;
});

calendarEventSchema.virtual('htmlLink').get(function () {
  return this.gcal_data ? this.gcal_data.htmlLink : null;
});

calendarEventSchema.methods.setGoogleCalendarData = function (data) {
  this.gcal_data = data;
  this.gcal_event_id = data.id;
};

calendarEventSchema.methods.verifyNewStartDate = function (newDate) {
  return moment(newDate).valueOf() != moment(this.start).valueOf();
};

module.exports = calendarEventSchema;
