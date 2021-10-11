const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vonageSchema = new Schema({
  accountId: { type: String, default: '' },
  accessToken: { type: String, default: '' },
  daysAgo: { type: Number, default: 0 },
  refreshToken: { type: String, default: '' },
});

module.exports = vonageSchema;
