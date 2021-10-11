const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSubscriptionSchema = new Schema({
  data: {
    stripe: {
      plan: { type: String },
      rate: { type: Number, default: 0 }, // 100 = $1
      setup: { type: Number, default: 0 }, // 100 = $1
    },
  },
});

module.exports = newSubscriptionSchema;
