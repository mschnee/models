const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesforceSchema = new Schema({
  tokens: {
    id: { type: String, required: true },
    instanceUrl: { type: String },
    tokenType: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    issuedAt: { type: String },
    signature: { type: String },
  },
  oauth2Token: {
    id: { type: String },
    instanceUrl: { type: String },
    accessToken: { type: String },
  },
});

salesforceSchema.methods.setTokens = function (tokens) {
  this.tokens = tokens;
};

module.exports = salesforceSchema;
