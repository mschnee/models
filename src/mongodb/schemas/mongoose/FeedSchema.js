const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  model: String,
  _data: { type: Schema.Types.ObjectId, refPath: 'model' },

  visibility: {
    byEmployee: { type: Boolean, default: false },
  },

  active: { type: Boolean, default: true },

  updated_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

feedSchema.index({
  _data: 1,
});

feedSchema.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = feedSchema;
