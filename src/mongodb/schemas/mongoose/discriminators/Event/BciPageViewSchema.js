const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bciPageViewSchema = new Schema({
  data: {
    state: { type: String },
  },
});

module.exports = bciPageViewSchema;
