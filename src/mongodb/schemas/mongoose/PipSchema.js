const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filestackSchema = require('./FilestackSchema');
const stepSchema = require('./StepSchema');

const pipSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _document: { type: Schema.Types.ObjectId, ref: 'Document', index: true },
    _conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', default: null },

    wizard: {
      overview_text: { type: String, default: '' },
      performance_concerns_type: { type: String, default: '' },
      performance_concerns_info: { type: String, default: '' },
      recurrence: { type: Boolean, default: false },
      documents: [filestackSchema],
      performance_expectations: [{ text: { type: String, default: '' } }],

      occurrence_details: [
        {
          text: { type: String, default: '' },
          date: { type: String, default: '' },
          time: { type: String, default: '' },
          verbal_confirmation: { type: Boolean, default: false },
        },
      ],

      suggested_strategies: [{ text: { type: String, default: '' } }],

      duration: { type: Number, default: 30 },
      followup_schedule: {
        type: String,
        enum: ['every day', 'every other day', 'once per week', 'once per month', 'week', 'month', 'year'],
        default: 'week',
      },
      completed_steps: [Schema.Types.Mixed],
    },

    documents: [filestackSchema],

    employee_signature: {
      text: { type: String, default: '' },
      signed_date: { type: String, default: '' },
      signed_timestamp: { type: Date, default: Date.now },
      ip: { type: String, default: '' },
    },

    manager_signature: {
      text: { type: String, default: '' },
      signed_date: { type: String, default: '' },
      signed_timestamp: { type: Date, default: Date.now },
      ip: { type: String, default: '' },
    },

    approved_by: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        approved_at: { type: Date, default: Date.now },
      },
    ],

    denied_by: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        denied_at: { type: Date, default: Date.now },
      },
    ],

    notes: [
      {
        key: { type: String, default: '' },
        note: { type: String, default: '' },
        employee: { type: Schema.Types.Mixed, default: '' },
        user: { type: Schema.Types.Mixed, default: '' },
        date: { type: Date, default: Date.now },
      },
    ],

    starts_at: { type: Date, default: Date.now },
    ends_at: { type: Date, default: Date.now },
    pip_sent_at: { type: Date, default: Date.now },

    followup_schedule: { type: String, default: '' },
    followups: [{ date: { type: Date, default: Date.now } }],

    timeline: [Schema.Types.Mixed],
    steps: [stepSchema],
    zendesk_ticket_id: { type: Number, default: null },
    status: { type: String, default: 'draft' },
    created_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  {
    usePushEach: true,
    versionKey: false,
    toJson: { virtuals: true },
  },
);

pipSchema.virtual('_feed', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_data',
  justOne: true,
});

pipSchema.methods.eventData = async function () {
  await this.populate({
    path: 'employee',
    model: 'User',
  }).execPopulate();

  const documentId = this.populated('_document') ? this._document._id : this._document;

  return {
    _id: this._id.toString(),
    _document: documentId ? documentId.toString() : null,
    employee: await this.employee.eventData(),
    type: 'Performance Improvement Plan',
    status: this.status,
    created_at: this.created_at,
  };
};

pipSchema.methods.approvedByData = async function () {
  await this.populate({
    path: 'approved_by.user',
    model: 'User',
    populate: {
      path: '_user',
    },
  }).execPopulate();

  const approved = this.approved_by.reverse()[0];

  return {
    approver: {
      email: approved.user._auth.email,
      profile: approved.user.profile,
    },
    approved_at: approved.approved_at,
  };
};

pipSchema.methods.deniedByData = async function () {
  await this.populate({
    path: 'denied_by.user',
    model: 'User',
    populate: {
      path: '_user',
    },
  }).execPopulate();

  const denied = this.denied_by.reverse()[0];

  return {
    approver: {
      email: denied.user._auth.email,
      profile: denied.user.profile,
    },
    denied_at: denied.denied_at,
  };
};

pipSchema.methods.notesData = async function () {
  await this.populate({
    path: 'notes.employee',
    model: 'User',
    populate: {
      path: '_user',
    },
  }).execPopulate();

  const notes = [];

  this.notes.forEach((note) => {
    notes.push({
      text: note.note,
      user: {
        email: note.employee._auth.email,
        profile: note.employee.profile,
      },
      date: note.date,
    });
  });

  return notes;
};

pipSchema.methods.generateSteps = async function () {
  await this.populate([
    {
      path: 'company',
    },
    {
      path: 'employee',
      populate: {
        path: '_auth',
      },
    },
  ]).execPopulate();

  this.steps = [
    {
      name: 'created',
      label: 'Created',
      icon: '',
    },
    {
      name: 'approval',
      label: 'Request Approval',
      icon: '',
    },
    {
      name: 'approved',
      label: 'Approved',
      icon: '',
    },
    {
      name:
        this.employee._auth.email && this.employee._auth.email.indexOf('@') == -1 && !this.employee.profile.phone
          ? 'print'
          : 'sign',
      label:
        this.employee._auth.email && this.employee._auth.email.indexOf('@') == -1 && !this.employee.profile.phone
          ? 'Print'
          : 'Sign',
      icon: '',
    },
    {
      name:
        this.employee._auth.email && this.employee._auth.email.indexOf('@') == -1 && !this.employee.profile.phone
          ? 'upload'
          : 'employee_sign',
      label:
        this.employee._auth.email && this.employee._auth.email.indexOf('@') == -1 && !this.employee.profile.phone
          ? 'Upload'
          : 'Employee Sign',
      icon: '',
    },
  ];

  return this.steps;
};

pipSchema.methods.wizardComplete = function () {
  return this.wizard.completed_steps.every((s) => s.complete);
};

module.exports = pipSchema;
