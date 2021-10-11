const { Schema } = require('mongoose');

const DeletedSchema = new Schema({
  deleted_at: { type: Date },
  deleted_by: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String },
});

module.exports = DeletedSchema;
