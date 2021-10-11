const _ = require('lodash');
const mongoose = require('mongoose');

const nodeSchema = require('./NodeSchema');

const Schema = mongoose.Schema;
const treeSchema = new Schema({
  name: { type: String, trim: true, lowercase: true, required: true, unique: true },
  nodes: [nodeSchema],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  schema_version: { type: String, default: '1.0.0' },
});

treeSchema.methods.addNode = function (node) {
  const child = this.nodes.create(node);

  if (node.parent) {
    const parent = this.nodes.find((n) => n._id == node.parent);
    if (!parent) throw new Error('parent node not found');

    parent.childs.addToSet(child._id);
  }

  this.nodes.push(child);

  return child;
};

treeSchema.methods.updateNode = function (node_id, node) {
  const current = this.nodes.find((n) => n._id.equals(node_id));

  if (!current) throw new Error('node not found');

  // if parent changes, remove node from current childs and add to new parents childs
  if (current.parent && !current.parent.equals(node.parent)) {
    const current_parent = this.nodes.find((n) => n._id.equals(current.parent));
    if (!current_parent) throw new Error('current parent node not found');

    //remove node from current root childs
    const current_node_index = current_parent.childs.indexOf((c) => current._id.equals(c));
    current_parent.childs.splice(current_node_index, 1);

    if (node.parent) {
      const new_parent = this.nodes.find((n) => n._id.equals(node.parent));
      if (!new_parent) throw new Error(`new parent node not found: ${node.parent}`);

      //add node to new parents childs
      new_parent.childs.addToSet(current._id);
    }

    //update current parent to new parent
    current.parent = node.parent;
  } else if (node.parent) {
    //current parent being set for the first time, just add to new parent
    const new_parent = this.nodes.find((n) => n._id.equals(node.parent));
    if (!new_parent) throw new Error(`new parent node not found: ${node.parent}`);

    //add node to new parents childs
    new_parent.childs.addToSet(current._id);

    //update current parent to new parent
    current.parent = node.parent;
  }

  current.label = node.label;
  current.description = node.description;
  current.image = node.image;

  this.markModified('nodes');
};

treeSchema.methods.changeNodeOrder = function (node_id, direction) {
  const index_direction = direction == 'up' ? -1 : +1;

  const node = this.nodes.find((n) => n._id == node_id);
  if (!node) throw new Error('node id not found');

  if (node.parent) {
    const parent = this.nodes.find((n) => n._id.equals(node.parent));
    const node_index = parent.childs.findIndex((c) => c.equals(node_id));
    parent.childs.splice(node_index, 1);
    parent.childs.splice(node_index + index_direction, 0, node._id);
  } else {
    const roots = this.nodes.filter((n) => !n.parent);
    const root_index = roots.findIndex((r) => r == node);

    const next_root_node = roots[root_index + index_direction];
    const next_node_index = this.nodes.findIndex((n) => n == next_root_node);

    const node_index = this.nodes.findIndex((n) => n == node);

    this.nodes.splice(node_index, 1);
    this.nodes.splice(next_node_index, 0, node);
  }

  this.markModified('nodes');
};

treeSchema.methods.deleteNode = function (node_id) {
  const node = this.nodes.find((n) => n._id == node_id);
  if (!node) throw new Error('node id not found');
  const node_questions = node.questions;

  this.questions = this.questions.filter((question) => {
    return !node_questions.some((node_question) => node_question.equals(question._id));
  });

  if (node.parent) {
    const parent = this.nodes.find((n) => n._id.equals(node.parent));
    if (!parent) throw new Error('parent not found');
    const node_index = parent.childs.findIndex((c) => c.equals(node_id));
    parent.childs.splice(node_index, 1);
  } else {
    const node_index = this.nodes.findIndex((n) => n == node);
    this.nodes.splice(node_index, 1);
  }

  this.markModified('questions');
  this.markModified('nodes');
};

treeSchema.methods.deleteQuestion = function (node = false, question_id) {
  const index = this.questions.findIndex((q) => q.equals(question_id));
  if (index == -1) throw new Error('question in node not found');

  this.questions.splice(index, 1);

  if (node) node.deleteQuestion(question_id);

  this.markModified('nodes');
};

treeSchema.methods.addQuestion = function (node = false, question) {
  if (node) node.addQuestion(question);
  this.questions.addToSet(question._id);

  this.markModified('nodes');
};

/**
 * do not delete, this method has a migration dependency
 * @returns [Question]
 */
treeSchema.methods.allQuestions = async function () {
  const nodes = this.nodes;
  const all_questions = await this.connection.models.Question.find();

  const questions = [
    ...nodes.map((n) =>
      n.questions.map((q_id) => {
        return all_questions.find((_q) => _q._id.equals(q_id));
      }),
    ),
  ];

  const option_questions = _.flatten(questions.map((q) => _.flatten(get_traversed_option_questions(q, all_questions))));

  return questions.concat(option_questions);
};

function get_traversed_option_questions(question, all_questions) {
  const option_questions = _.flatten(
    question.options.map((option) => {
      return _.flatten(
        option.questions.map((q_id) => {
          const foundQuestion = all_questions.find((q) => q._id.equals(q_id));
          return _.flatten([foundQuestion, get_traversed_option_questions(foundQuestion, all_questions)]);
        }),
      );
    }),
  );

  return _.flatten(option_questions);
}

module.exports = treeSchema;
