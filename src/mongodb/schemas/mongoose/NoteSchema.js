const { Schema } = require('mongoose');

const noteSchema = new Schema({
  note: { type: String, default: '' },
  created_by: { type: Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
});

module.exports = noteSchema;
