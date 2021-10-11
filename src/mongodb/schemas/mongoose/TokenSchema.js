const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const tokenSchema = new Schema({
  token: { type: String, trim: true, default: '' },
  generated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

tokenSchema.methods.generateJWT = function (payload, secret) {
  const token = jwt.sign(payload, secret + process.env.JWT_SECRET);
  this.token = token;

  this.generated_at = Date.now();

  return token;
};

tokenSchema.methods.verifyJWT = function (token, secret) {
  //const decoded = jwt.verify(token, this._id.toString() + secret + JWT_SECRET)
  const decoded = jwt.verify(token, secret + process.env.JWT_SECRET);

  return decoded;
};

module.exports = tokenSchema;
