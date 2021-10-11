const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addedEmployeesSchema = new Schema({
  data: {
    addedCount: { type: Number },
  },
});

module.exports = addedEmployeesSchema;
