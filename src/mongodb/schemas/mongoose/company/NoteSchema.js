const { Schema } = require('mongoose');

const needSchema = require('./NeedSchema');
const employeesSchema = require('./EmployeesSchema');

const noteSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  pinned: { type: Boolean, default: false },
  text: { type: String, default: '' },
  needs: [needSchema],
  employees: [employeesSchema],
  _regardingEmployees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = noteSchema;
