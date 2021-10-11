const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentFailureSchema = new Schema({
  data: {
    reason: { type: String },
  },
});

module.exports = paymentFailureSchema;
