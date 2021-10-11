const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  url: { type: String, default: '' },
  filename: { type: String },
  name: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  id: { type: Number },
  uploaded_date: { type: Date, default: Date.now },
});

const signedMappingSchema = new Schema({
  ref_id: { type: Schema.Types.ObjectId },
  refused: { type: Boolean, default: false },
  signed_id: { type: Schema.Types.ObjectId, default: null },
});

const stepSchema = require('./StepSchema');

const logSchema = new Schema({
  log_type: { type: String, default: '' },
  log_message: { type: String, default: '' },
  log_date: { type: Date, default: Date.now },
});

const terminationSchema = new Schema({
  termination_tree: { type: String, default: '' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  employee: { type: Schema.Types.ObjectId, ref: 'User' },

  termination_date: { type: String, default: '' },
  final_pay: { type: String, default: '' },
  separation_pay: { type: Boolean, default: false },
  separation_pay_text: { type: String, default: '' },
  termination_sign_period: { type: String, default: '7 days' },

  qna: { type: Schema.Types.ObjectId, ref: 'Qna' },

  active: {
    node: { type: Schema.Types.ObjectId, default: null },
  },

  nodes: [{ type: Schema.Types.Mixed }],
  questions: [{ type: Schema.Types.Mixed }],

  score: { type: Number, default: 800 },

  status: { type: String, enum: ['active', 'canceled', 'complete', 'abandoned', 'broken'], default: 'active' },

  states: {
    scheduled_call: { type: String, enum: ['', 'morning', 'afternoon', 'evening'], default: '' },
    spoken: { type: Boolean, default: false },
    termination_packet: [fileSchema],
    signed_packet_map: [signedMappingSchema],
    signed_documents: [fileSchema],
    termination_bambee_documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    signed_bambee_documents_map: [signedMappingSchema],
    checklist_complete: { type: Boolean, default: false },
    verified_date: { type: Date, default: null },
    packet_downloaded: { type: Boolean, default: false },
  },

  logs: [logSchema],
  steps: [stepSchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

terminationSchema.virtual('_feed', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_data',
  justOne: true,
});

terminationSchema.pre('save', function () {
  this.updated_at = new Date();
});

terminationSchema.methods.eventData = async function () {
  await this.populate('employee').execPopulate();

  return {
    _id: this._id,
    termination_tree: this.termination_tree,
    employee: this.employee.eventData(),
    status: this.status,
    created_at: this.created_at,
  };
};

terminationSchema.methods.node = function (node_id) {
  return this.nodes.find((n) => n._id.equals(node_id));
};

terminationSchema.methods.question = function (question_id) {
  return this.questions.find((q) => q._id.equals(question_id));
};

terminationSchema.methods.activateNode = function (node_id) {
  const node = this.node(node_id);

  if (node.status != 'complete') {
    this.active.node = node_id;
    node.status = 'active';
    this.markModified('nodes');
  }

  return node;
};

terminationSchema.methods.completeNode = function (node_id) {
  const node = this.node(node_id);

  node.status = 'complete';

  const all_nodes_complete = this.nodes.every((n) => n.status == 'complete');
  if (all_nodes_complete) this.active.node = null;
  //this.mapTerminationLetter()

  this.markModified('nodes');

  return node;
};

terminationSchema.methods.calculateScore = function (qna_obj) {
  this.score = randomIntFromInterval(551, 850);
};
/*
Reads in user and company and pre-populates termination Q&A
 */
terminationSchema.methods.prefillTerminationLetterAnswers = async function (qna_obj) {
  await this.populate('employee qna').execPopulate();
  await this.employee.populate('_company').execPopulate();

  const employee = this.employee;
  const company = this.employee._company;

  const map_keys = [
    'company.name',
    'company.profile.address',
    'company.profile.city',
    'company.profile.state',
    'company.profile.zip',
    'user.profile.full_name',
    'user.profile.address',
    'user.profile.city',
    'user.profile.state',
    'user.profile.zip',
  ];

  qna_obj.questions.forEach((q) => {
    q.options
      .filter((o) => map_keys.includes(o.map_key))
      .forEach((o) => {
        switch (o.map_key) {
          case 'company.name':
            o.value = company.name;
            break;
          case 'company.profile.address':
            o.value = company.profile.address;
            break;
          case 'company.profile.city':
            o.value = company.profile.city;
            break;
          case 'company.profile.state':
            o.value = company.profile.state;
            break;
          case 'company.profile.zip':
            o.value = company.profile.zip;
            break;
          case 'user.profile.full_name':
            o.value = employee.profile.full_name;
            break;
          case 'user.profile.address':
            o.value = employee.profile.address;
            break;
          case 'user.profile.city':
            o.value = employee.profile.city;
            break;
          case 'user.profile.state':
            o.value = employee.profile.state;
            break;
          case 'user.profile.zip':
            o.value = employee.profile.zip;
            break;
        }
      });
  });

  qna_obj.markModified('questions');
  await qna_obj.save();
};

/*
Reads in termination Q&A and populates termination, user and company fields
 */
terminationSchema.methods.mapTerminationLetter = async function () {
  await this.populate('employee qna').execPopulate();
  await this.employee.populate('_company').execPopulate();

  const employee = this.employee;
  const company = this.employee._company;

  const map_keys = [
    'company.name',
    'company.profile.address',
    'company.profile.city',
    'company.profile.state',
    'company.profile.zip',
    'user.profile.full_name',
    'user.profile.address',
    'user.profile.city',
    'user.profile.state',
    'user.profile.zip',
    'termination.termination_date',
    'termination.separation_pay',
    'termination.separation_pay_text',
    'termination.termination_sign_period',
  ];

  this.qna.questions.forEach((q) => {
    q.answers
      .filter((a) => map_keys.includes(a.map_key))
      .forEach((a) => {
        switch (a.map_key) {
          case 'company.name':
            company.name = a.value;
            break;
          case 'company.profile.address':
            company.profile.address = a.value;
            break;
          case 'company.profile.city':
            company.profile.city = a.value;
            break;
          case 'company.profile.state':
            company.profile.state = a.value;
            break;
          case 'company.profile.zip':
            company.profile.zip = a.value;
            break;
          case 'user.profile.full_name':
            employee.profile.full_name = a.value;
            break;
          case 'user.profile.address':
            employee.profile.address = a.value;
            break;
          case 'user.profile.city':
            employee.profile.city = a.value;
            break;
          case 'user.profile.state':
            employee.profile.state = a.value;
            break;
          case 'user.profile.zip':
            employee.profile.zip = a.value;
            break;
          case 'termination.termination_date':
            this.termination_date = a.value;
            break;
          case 'termination.separation_pay':
            this.separation_pay = a.value;
            break;
          case 'termination.separation_pay_text':
            this.separation_pay_text = a.value;
            break;
          case 'termination.termination_sign_period':
            this.termination_sign_period = '21 days';
            break;
        }
      });
  });
};

terminationSchema.methods.answerQuestion = function (question_id, option_id, input) {
  const question = this.question(question_id);

  if (!question) throw new Error(`question not found ${question_id}`);

  const answer = question.options.find((o) => o._id.equals(option_id));
  if (!answer) throw new Error(`answer not found ${option_id}`);

  if (input) answer.value = input;

  if (!question.multi) question.answers[0] = answer;
  //todo: this is not correct, need to accept array and handle update
  else question.answers.push(answer);

  question.status = 'complete';

  this.markModified('questions');

  return question;
};

terminationSchema.methods.checklistComplete = async function () {
  await this.populate('qna').execPopulate();

  this.qna.markComplete();

  await this.qna.save();

  this.states.checklist_complete = true;
  //this.states.verified_date = moment().add('30','minute')
  this.score = 800;
};

terminationSchema.methods.addSignedDocuments = function (files) {
  files.forEach((f) => {
    this.states.signed_documents.push(f);
  });

  this.markModified('states');

  return this.states.signed_documents;
};

terminationSchema.methods.addLog = function (log) {
  this.logs.push(log);
  return this.logs;
};

terminationSchema.methods.addTerminationPacket = function (files) {
  files.forEach((f) => {
    this.states.termination_packet.push(f);
  });

  return this.states.termination_packet;
};

terminationSchema.methods.generateSteps = async function generateSteps() {
  this.steps = [
    {
      name: 'requested',
      label: 'Requested',
      icon: '',
      complete: true,
      active: true,
      _completedBy: null,
    },
    {
      name: 'human_magic',
      label: 'Human Magic',
      icon: '',
      _completedBy: null,
    },
    {
      name: 'print',
      label: 'Print Documents',
      icon: '',
      _completedBy: null,
    },
    {
      name: 'upload_signed',
      label: 'Upload Signed',
      icon: '',
      _completedBy: null,
    },
  ];

  return this.steps;
};

terminationSchema.methods.getActiveStep = function () {
  return this.steps.find((s) => s.active).name;
};

/**
 * Activates a specified step.
 *
 * When a step is activated, the previously activated step in the termination flow
 * is marked as `completed`.
 */
terminationSchema.methods.setActiveStep = function (stepName, completedByID) {
  const nextStep = this.steps.find((step) => step.name === stepName);

  if (!nextStep) return;

  const currentStep = this.steps.find((step) => step.active);

  currentStep.complete = true;
  currentStep._completedBy = completedByID;
  currentStep.active = false;

  nextStep.active = true;

  this.markModified('steps');
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = terminationSchema;
