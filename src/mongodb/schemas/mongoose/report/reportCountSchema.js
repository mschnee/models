const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportCountSchema = new Schema({
  data: { type: Number, default: 0 },
});

module.exports = reportCountSchema;
