const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loggedInSchema = new Schema({
  data: {
    ip: { type: 'String', trim: true },
  },
});

module.exports = loggedInSchema;
