const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  label: { type: String, trim: true },
  description: { type: String, trim: true },
  value: { type: Schema.Types.Mixed },
  select_options: { type: String, trim: true, default: '' },
  flagged: { type: String, enum: ['', 'fixable', 'not-fixable'], default: '' },
  flag: {
    label: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
  },
  type: { type: String, enum: ['defined', 'select', 'input', 'file'], default: 'defined' },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  point_value: { type: Number, default: 0 },

  map_key: { type: String, default: null },
});

optionSchema.methods.addQuestion = function (question_id) {
  this.questions.addToSet(question_id);
};

optionSchema.methods.deleteQuestion = function (question_id) {
  const index = this.questions.indexOf(question_id);

  this.questions.splice(index, 1);
};

const questionSchema = new Schema({
  label: { type: String, trim: true },
  description: { type: String },
  multi: { type: Boolean },
  total_points: { type: Number, default: 0 },

  options: [optionSchema],
  answers: [optionSchema],

  conditional: {
    active: { type: Boolean, default: false },
    question_id: { type: Schema.Types.ObjectId, default: null },
    option_id: { type: Schema.Types.ObjectId, default: null },
  },

  status: { type: String, enum: ['disabled', 'active', 'complete'], default: 'disabled' },
});

questionSchema.methods.option = function (option_id) {
  return this.options.find((o) => o._id.equals(option_id));
};

questionSchema.methods.addConditionalQuestion = function (option, question_id) {
  option.addQuestion(question_id);

  this.markModified('options');
};

questionSchema.methods.deleteConditionalQuestion = function (option, question_id) {
  option.deleteQuestion(question_id);

  this.markModified('options');
};

module.exports = questionSchema;
