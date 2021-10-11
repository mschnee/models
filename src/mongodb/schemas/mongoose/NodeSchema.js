const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  url: { type: String, default: '' },
  filename: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  id: { type: Number },
});

const introSchema = new Schema({
  title: String,
});

const nodeSchema = new Schema({
  label: { type: String, required: true },
  description: { type: String, trim: true },
  image: { type: fileSchema, default: {} },
  intro: introSchema,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  childs: [{ type: Schema.Types.ObjectId }],
  parent: { type: Schema.Types.ObjectId },
  status: { type: String, enum: ['disabled', 'active', 'complete'], default: 'disabled' },
});

nodeSchema.methods.addQuestion = function (question) {
  if (question.conditional.active) {
    //check if question exists
    const exists = this.questions.find((q) => q.equals(question._id));

    if (!exists) {
      //find index of conditional question in nodes and add after
      const conditional_index = this.questions.findIndex((q) => q.equals(question.conditional.question_id));

      if (conditional_index == -1) throw new Error('conditional question not found');

      this.questions.splice(conditional_index + 1, 0, question._id);
    }
  }

  this.questions.addToSet(question._id);
  this.markModified('questions');
};

nodeSchema.methods.changeQuestionOrder = function (question_id, direction) {
  const current_index = this.questions.findIndex((q) => q == question_id);
  if (current_index == -1) throw new Error(`question id not found, ${question_id}`);

  const index_direction = direction == 'up' ? -1 : +1;
  const next_index = current_index + index_direction;

  //remove from current index
  this.questions.splice(current_index, 1);
  this.questions.splice(next_index, 0, question_id);
};

nodeSchema.methods.deleteQuestion = function (question_id) {
  const index = this.questions.findIndex((q) => q.equals(question_id));
  if (index == -1) throw new Error('question in node not found');

  this.questions.splice(index, 1);
};

module.exports = nodeSchema;
