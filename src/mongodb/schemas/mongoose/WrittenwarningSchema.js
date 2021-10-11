const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filestackSchema = require('./FilestackSchema');
const stepSchema = require('./StepSchema');

const writtenWarningSchema = new Schema(
  {
    legacy_id: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _document: { type: Schema.Types.ObjectId, ref: 'Document', index: true },
    _conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', default: null },
    isFinal: { type: Boolean, default: false },

    wizard: {
      overview_text: { type: String, default: '' },
      performance_concerns_type: { type: String, default: '' },
      performance_concerns_info: { type: String, default: '' },
      recurrence: { type: Boolean, default: false },
      documents: [filestackSchema],
      consequences: [
        {
          text: { type: String, default: '' },
          info: { type: String, default: '' },
        },
      ],
      performance_expectations: [{ text: { type: String, default: '' } }],
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
        employee: { type: Schema.Types.ObjectId, ref: 'User' }, // TODO: Auth Refactor. Deprecate one of these
        approved_at: { type: Date, default: Date.now },
      },
    ],

    denied_by: [
      {
        employee: { type: Schema.Types.ObjectId, ref: 'User' }, // TODO: Auth Refactor. Deprecate one of these
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

writtenWarningSchema.virtual('_feed', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_data',
  justOne: true,
});

// TODO: BAM-1661 requires updating employee reference to employee and the employee prop has necessary information.
// check if company is used and refactor
writtenWarningSchema.methods.eventData = async function () {
  await this.populate({
    path: 'employee',
    model: 'User',
  }).execPopulate();

  const documentId = this.populated('_document') ? this._document._id : this._document;

  return {
    _id: this._id.toString(),
    _document: documentId.toString(),
    employee: await this.employee.eventData(),
    type: 'Written Warning',
    status: this.status,
    created_at: this.created_at,
  };
};

writtenWarningSchema.methods.approvedByData = async function () {
  await this.populate({
    path: 'approved_by.employee',
    model: 'User',
  }).execPopulate();

  const approved = this.approved_by.reverse()[0];

  return {
    approver: {
      email: approved.employee._auth.email,
      profile: approved.employee.profile.toObject(),
    },
    approved_at: approved.approved_at,
  };
};

writtenWarningSchema.methods.deniedByData = async function () {
  await this.populate({
    path: 'denied_by.employee',
    model: 'User',
  }).execPopulate();

  const denied = this.denied_by.reverse()[0];

  return {
    approver: {
      email: denied.employee._auth.email,
      profile: denied.employee.profile.toObject(),
    },
    denied_at: denied.denied_at,
  };
};

writtenWarningSchema.methods.notesData = async function () {
  await this.populate({
    path: 'notes.employee',
    model: 'User',
  }).execPopulate();

  const notes = [];

  this.notes.forEach((note) => {
    // HOTFIX: data integrity issues: we have note.employee and note.user
    const userEmail =
      (note.employee && note.employee._auth && note.employee._auth.email) ||
      (note.user && note.user._auth && note.user._auth.email) ||
      'unknown';

    const userProfile =
      (note.employee &&
        note.employee.profile &&
        note.employee.profile.toObject &&
        typeof note.employee.profile.toObject === 'function' &&
        note.employee.profile.toObject()) ||
      (note.user &&
        note.user.profile &&
        note.user.profile.toObject &&
        typeof note.user.profile.toObject === 'function' &&
        note.user.profile.toObject()) ||
      {};

    notes.push({
      text: note.note,
      user: {
        email: userEmail,
        profile: userProfile,
      },
      date: note.date,
    });
  });

  return notes;
};

writtenWarningSchema.methods.generateSteps = async function () {
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
  ];

  if (this.isFinal)
    this.steps.push(
      {
        name: 'sign',
        label: 'Sign',
        icon: '',
      },
      {
        name: 'finalPrint',
        label: 'View',
        icon: '',
      },
      {
        name: 'meeting',
        label: 'Meeting Complete',
        icon: '',
      },
      {
        name: 'employee_sign',
        label: 'Awaiting Employee Signature',
        icon: '',
      },
    );
  else
    this.steps.push(
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
    );

  return this.steps;
};

writtenWarningSchema.methods.wizardComplete = function () {
  return this.wizard.completed_steps.every((s) => s.complete);
};

module.exports = writtenWarningSchema;
