const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = systemSchema;
