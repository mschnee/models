const { Schema } = require('mongoose');

const employeesSchema = new Schema({
  value: { type: String, default: '' },
  name: { type: String, default: '' },
});

module.exports = employeesSchema;
