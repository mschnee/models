const mongoose = require('mongoose');
const { reportCardsCadence } = require('../../constants/reportCards');
const Schema = mongoose.Schema;

/**
 * Report Cards Schema
 *
 * @type {mongoose.Schema}
 */

const updateHistorySchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  _graded_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  grade: { type: String, enum: ['A', 'B', 'C', 'skipped', 'pending'], default: 'pending' },
  note: { type: String, default: '' },
  feedback: { type: String, default: '' },
});

const gradeSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  _graded_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'skipped', 'pending'], default: 'pending' },
  note: { type: String, default: '' },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['created', 'completed'], default: 'created' },
});

const reportCardSchema = new Schema({
  _company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: '' },
  status: { type: String, enum: ['created', 'completed'], default: 'created' },
  cadence: { type: String, enum: reportCardsCadence, default: 'monthly' },
  employees: [gradeSchema],
  updateHistory: [updateHistorySchema],
});

reportCardSchema.pre('save', function () {
  this.updated_at = new Date();
});

reportCardSchema.methods.eventData = async function () {
  await this.populate('_created_by _company').execPopulate();
  return {
    _id: this._id,
    _created_by: await this._created_by.eventData(),
    _company: this._company.eventData(),
    created_at: this.created_at,
    status: this.status,
  };
};

reportCardSchema.methods.getSnapShot = async function () {
  await this.populate('employees._employee employees._graded_by').execPopulate();

  return this.employees.map((e) => {
    return {
      _employee: e._employee,
      _manager: e._graded_by,
    };
  });
};

module.exports = reportCardSchema;
