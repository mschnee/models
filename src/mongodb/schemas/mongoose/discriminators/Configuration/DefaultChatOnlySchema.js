const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatOnlySchema = new Schema({
  _managers: [
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

module.exports = chatOnlySchema;
