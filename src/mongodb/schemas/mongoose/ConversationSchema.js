const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    _advisor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', index: true },
    type: { type: String, default: '' },
    intercom_conversation_id: { type: Number, default: null },

    intercom_data: { type: Schema.Types.Mixed, default: null },

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

conversationSchema.index({
  intercom_conversation_id: 1,
});

conversationSchema.index({
  _advisor: 1,
  updated_at: -1,
});

conversationSchema.virtual('conversation_message').get(function () {
  return this.intercom_data && this.intercom_data.conversation_message ? this.intercom_data.conversation_message : null;
});

conversationSchema.virtual('conversation_parts').get(function () {
  return this.intercom_data && this.intercom_data.conversation_parts
    ? this.intercom_data.conversation_parts.conversation_parts
    : [];
});

conversationSchema.virtual('conversation_parts_count').get(function () {
  return this.intercom_data && this.intercom_data.conversation_parts
    ? this.intercom_data.conversation_parts.total_count
    : 0;
});

conversationSchema.virtual('state').get(function () {
  return this.intercom_data && this.intercom_data.state ? this.intercom_data.state : null;
});

conversationSchema.virtual('read').get(function () {
  return this.intercom_data && this.intercom_data.read ? this.intercom_data.read : false;
});

conversationSchema.pre('save', function () {
  this.updated_at = new Date();
});

conversationSchema.methods.addConversationPart = function (part) {
  const exists = this.intercom_data.conversation_parts.conversation_parts.some((c) => c.id == part.id);

  if (exists) return;

  this.intercom_data.conversation_parts.conversation_parts.push(part);
  this.intercom_data.read = false;

  this.markModified('intercom_data');
};

module.exports = conversationSchema;
