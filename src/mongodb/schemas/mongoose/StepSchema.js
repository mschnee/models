const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  icon: { type: String, default: '' },

  active: { type: Boolean, default: false },
  complete: { type: Boolean, default: false },
  _completedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  timestamps: {
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
});

module.exports = stepSchema;
