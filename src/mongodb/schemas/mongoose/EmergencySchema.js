const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencySchema = new Schema(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relationship: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  {
    _id: false,
    id: false,
  },
);

module.exports = emergencySchema;
