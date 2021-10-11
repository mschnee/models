const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rehireSchema = new Schema({
  templates: [Schema.Types.ObjectId],
});

module.exports = rehireSchema;
