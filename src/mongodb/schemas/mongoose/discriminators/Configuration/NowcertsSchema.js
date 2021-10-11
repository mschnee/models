const { Schema } = require('mongoose');

const nowcertsSchema = new Schema({
  username: { type: String, default: '' },
  password: { type: String, default: '' },
  accessToken: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  tokenIssued: { type: Date, default: '' },
  tokenExpires: { type: Date, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

nowcertsSchema.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = nowcertsSchema;
