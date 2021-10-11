const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = require('./StepSchema');
const noteSchema = require('./NoteSchema');

const steps = {
  type: [stepSchema],
  default: [
    {
      name: 'requested',
      label: 'Requested',
      icon: '',
    },
    {
      name: 'created',
      label: 'Human Magic',
      icon: '',
    },
    {
      name: 'ready',
      label: 'Ready',
      icon: '',
    },
    {
      name: 'sent',
      label: 'Sent for Signature',
      icon: '',
    },
    {
      name: 'implemented',
      label: 'Implemented',
      icon: '',
    },
  ],
};

const policySchema = new Schema(
  {
    _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _documents: [{ type: Schema.Types.ObjectId, ref: 'Document', index: true }],
    _feeds: [{ type: Schema.Types.ObjectId, ref: 'Feed', index: true }],
    _conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', default: null, index: true },
    _documentTemplate: { type: Schema.Types.ObjectId, ref: 'DocumentTemplate', default: null },

    kind: { type: String, enum: ['bambee', 'panda', 'draft'], default: 'bambee' },
    panda: {
      documentFromPdf: {
        id: { type: String, index: true },
        preview: {
          id: { type: String },
          expires_at: { type: Date },
        },
      },

      globalTemplate: {
        id: { type: String, index: true },
        preview: {
          id: { type: String },
          expires_at: { type: Date },
        },
      },
      approvalDocument: {
        id: { type: String, index: true },
        // deprecated
        status: {
          required: false,
          type: String,
          default: null,
        },
        preview: {
          id: { type: String },
          expires_at: { type: Date },
        },
      },
      companyTemplate: {
        id: { type: String, index: true },
        preview: {
          id: { type: String },
          expires_at: { type: Date },
        },
      },
      standardTemplate: { type: Boolean, default: false },
    },

    name: { type: String, default: '' },
    displayName: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },

    delta: { type: Schema.Types.Mixed, default: null },
    html: { type: String },
    editor: { type: String, enum: [null, 'quill', 'ckeditor'], default: null },

    version: { type: Number, default: 1 },

    notes: [noteSchema],

    steps: steps,

    isContractor: { type: Boolean, default: false },
    isPdfUpload: { type: Boolean, default: false },

    status: {
      type: String,
      default: 'created',
      enum: [
        'created',
        'uploaded',
        'qa',
        'ready',
        'sent',
        'declined',
        'approved',
        'in-progress',
        'complete',
        'canceled',
      ],
    },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    signatures_required: [{ type: String, enum: ['employee', 'manager'] }],
    from_blank: { type: Boolean, default: false },
  },
  {
    usePushEach: true,
    toJson: { virtuals: true },
  },
);

policySchema.virtual('_logs', {
  ref: 'Modellog',
  localField: '_id',
  foreignField: '_data',
});

policySchema.pre('save', function () {
  if (!this.displayName || this.displayName === '') {
    this.displayName = this.name;
  }
});

policySchema.methods.signed = function (user) {
  if (this._documents.every((d) => d.signed) && this._documents.length > 0) {
    this.status = 'complete';
    this.completeStep('sent', user);
    this.completeStep('implemented', user);
  }
};

policySchema.methods.cancelPolicy = function () {
  this.steps.forEach((s) => {
    s.complete = false;
    s.active = false;
  });

  this.status = 'canceled';
  this.active = false;
};

policySchema.methods.getStep = function (step_name) {
  return this.steps.find((s) => s.name == step_name);
};

/*
Marks a step complete and inactive

returns step
 */
policySchema.methods.completeStep = function (step_name, user) {
  const step = this.getStep(step_name);

  if (!step) throw new Error(`step '${step_name}' not found`);

  step.complete = true;
  step.active = false;
  step._completedBy = user;

  return step;
};

policySchema.methods.activateStep = function (step_name) {
  this.steps.forEach((s) => (s.active = false));

  const step = this.getStep(step_name);

  step.active = true;
  step.complete = false;

  return step;
};

policySchema.methods.inCompleteStep = function (step_name) {
  const step = this.getStep(step_name);

  step.complete = false;

  return step;
};

policySchema.methods.eventData = async function () {
  await this.populate('_company').execPopulate();

  return {
    id: this._id,
    name: this.name,
    company: await this._company.eventData(),
  };
};

module.exports = policySchema;
