const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onboardingSchema = new Schema({
  _coordinators: [
    {
      _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      lastAssignment: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = onboardingSchema;
