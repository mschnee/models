const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advisorSchema = new Schema({
  _advisor: { type: Schema.Types.ObjectId, ref: 'User' },
});

// advisorSchema.pre('findOne', function () {
//   return this.populate({
//     path: '_advisor',
//     populate: {
//       path: 'settings.calendar_channel',
//       model: 'GoogleWatchChannel'
//     }
//   })
// })

module.exports = advisorSchema;
