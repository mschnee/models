const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const insuranceAgentSchema = new Schema({
  _insuranceAgents: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  followUp: {
    duration: { type: Number, default: 10 },
    lookAfter: { type: Number, default: 60 },
    lookAfterNoShow: { type: Number, default: 60 * 12 },
    wait: { type: Number, default: 15 },

    preLimit: { type: Number, default: 6 },
    postLimit: { type: Number, default: 6 },
  },
  officeHour: {
    start: { type: Date },
    duration: { type: Number },
    interval: { type: Number },
    availableDays: [
      {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        default: [1, 2, 3, 4, 5],
      },
    ],
  },
});

// insuranceAgentSchema.pre('findOne', function () {
//   return this.populate({
//     path: '_insuranceAgents',
//     populate: [{
//       path: 'settings.calendar_channel',
//       model: 'GoogleWatchChannel'
//     }, {
//       path: '_auth',
//       model: 'Auth'
//     }]
//   })
// })

module.exports = insuranceAgentSchema;
