const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pandaDocSchema = new Schema({
  globalTemplatesFolder: { type: String },
  globalStandardTemplatesFolder: { type: String },
  companiesTemplateFolder: { type: String },
  companiesDocumentFolder: { type: String },
  tokens: {
    token_type: { type: 'String' },
    access_token: { type: 'string' },
    refresh_token: { type: 'string' },
  },
});

pandaDocSchema.methods.setTokens = function (tokens) {
  this.tokens = tokens;
};

module.exports = pandaDocSchema;
