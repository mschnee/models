const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const filestackSchema = require('./FilestackSchema');

const ticketMessageSchema = new Schema({
  name: { type: String, default: null },
  text: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  files: [filestackSchema],
  _conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', default: null },
});

/*
todo: incomplete
converts message to zendesk comment
 */
ticketMessageSchema.methods.toZendeskComment = function () {
  const text = this.text;
  const files_text = this.files.map((f) => f.url).join('\n');

  let message = `${text} \n`;

  if (files_text) message += `Files \n ${files_text}`;

  return {
    body: message,
  };
};

const modifySchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, default: '' },
  remark: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
});

const ticketSchema = new Schema({
  _created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  _requested_by: { type: Schema.Types.ObjectId, ref: 'User' },
  _assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
  _company: { type: Schema.Types.ObjectId, ref: 'Company' },
  _employee: { type: Schema.Types.ObjectId, ref: 'User' },
  _conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  _modified_by: { type: Schema.Types.ObjectId, ref: 'User' },
  _ref: {
    model: { type: String, default: '' },
    _data: { type: Schema.Types.ObjectId, refPath: '_ref.model' },
  },
  zendesk_ticket_id: { type: Number, default: null },

  type: { type: String },
  title: { type: String, required: true },
  message: { type: ticketMessageSchema },
  core_icon_url: { type: String, default: '' },
  skipped_reason: { type: String, default: '' }, //TODO: BAM-1772 may become an array if ticket can be revived after skipping
  note: { type: String, default: '' }, //TODO: BAM-1772 may become an array

  thread: [ticketMessageSchema],
  status: { type: String, lowercase: true, enum: ['open', 'solved', 'closed', 'closed-out'], default: 'open' },
  todo_status: {
    type: String,
    lowercase: true,
    enum: ['requested', 'complete', 'skipped', 'snoozed', 'overdue'],
    default: 'requested',
  }, //internal todo status
  todo_type: { type: String, enum: ['core', 'automated', 'manual'], default: 'manual' },
  hidden: { type: Boolean, default: false },

  times_snoozed: [modifySchema],

  created_at: { type: Date, default: Date.now },
  due_date: { type: Date, default: null },
  completed_date: { type: Date, default: null },
  updated_at: { type: Date, default: Date.now },

  // Added in BAM-2182, need this property to make todos look like they're cancelled
  active: { type: Boolean, default: true },
});

ticketSchema.index({ title: 'text' });
ticketSchema.index({
  _company: 1,
  type: 1,
});

ticketSchema.index({ title: 'text' });
ticketSchema.plugin(mongoosePaginate);

//TODO: BAM-1918 may need refactoring and not use this at all
ticketSchema.virtual('type_label', function () {
  const type_mapping = {
    handbook: 'Employee Handbook',
    onboarding: 'Onboard New Employee',
    wagehour: 'Wage & Hour Question',
    cap: 'Corrective Action',
    employees: 'Employee Issue',
    claims: 'Department of Labor Claim',
    general: 'General HR + Compliance',
    'job-description': 'Job Descriptions',
    'new-policy': 'New Policy',
    terminate: 'Terminate Employee',
  };

  return this.type ? type_mapping[this.type] : null;
});

ticketSchema.virtual('_logs', {
  ref: 'Modellog',
  localField: '_id',
  foreignField: '_data',
});

module.exports = ticketSchema;
