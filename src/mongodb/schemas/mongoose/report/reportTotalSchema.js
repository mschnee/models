const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const byCompanySchema = new Schema({
  _id: { type: String, default: null, lowercase: true },
  name: { type: String, trim: true, required: true, min: 3 },
  plan: { type: String, default: '20' },
  state: { type: String, default: '' },
  stripe_id: { type: String, default: '' },
  hrAdvisor: {
    id: { type: String, default: null, lowercase: true },
    name: { type: String, default: '' },
  },
  owner: {
    id: { type: String, default: null, lowercase: true },
    name: { type: String, default: '' },
    email: { type: String, lowercase: true, trim: true, default: null },
  },
  created_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  isLead: { type: Boolean, default: false },
  users: {
    users: { type: Number, default: 0 },
    owners: { type: Number, default: 0 },
    employees: { type: Number, default: 0 },
    managers: { type: Number, default: 0 },
    approvers: { type: Number, default: 0 },
  },
  employees: {
    employees_onboarding_sent: { type: Number, default: 0 },
    employees_not_invited: { type: Number, default: 0 },
    employees_signed_up: { type: Number, default: 0 },
  },
  documents: {
    documents: { type: Number, default: 0 },
    policies: { type: Number, default: 0 },
    incidents: { type: Number, default: 0 },
    verbals: { type: Number, default: 0 },
    writtens: { type: Number, default: 0 },
    pips: { type: Number, default: 0 },
    signature_requested: { type: Number, default: 0 },
    signed: { type: Number, default: 0 },
  },
  verbals: {
    verbals: { type: Number, default: 0 },
  },
  writtens: {
    writtens: { type: Number, default: 0 },
    signature_requests: { type: Number, default: 0 },
    signed: { type: Number, default: 0 },
  },
  pips: {
    pips: { type: Number, default: 0 },
    signature_requests: { type: Number, default: 0 },
    signed: { type: Number, default: 0 },
  },
  folders: {
    folders: { type: Number, default: 0 },
  },
  feeds: {
    feeds: { type: Number, default: 0 },
  },
  policies: {
    policies: { type: Number, default: 0 },
    policies_started: { type: Number, default: 0 },
    policies_completed: { type: Number, default: 0 },
    policies_approved: { type: Number, default: 0 },
    policies_sent: { type: Number, default: 0 },
    signature_requests: { type: Number, default: 0 },
    signed: { type: Number, default: 0 },
  },
  terminations: {
    terminations: { type: Number, default: 0 },
  },
  tickets: {
    tickets: { type: Number, default: 0 },
    tickets_closed: { type: Number, default: 0 },
    tickets_open: { Number, default: 0 },
  },
  signatures: {
    signature_requests: { type: Number, default: 0 },
    signed: { type: Number, default: 0 },
  },
  resignations: {
    resignations: { type: Number, default: 0 },
  },
  audits: {
    audits: { type: Number, default: 0 },
    audits_completed: { type: Number, default: 0 },
  },
  onboarded: { type: Boolean, default: false },
  timestamps: {
    ticket: {
      type: Date,
      default: Date.now(),
    },
    conversation: {
      type: Date,
      default: Date.now(),
    },
  },
  show_report_card: { type: Boolean, default: false },
  report_card: {
    status: { type: String, default: '' },
    grade_a: { type: Number, default: 0 },
    grade_b: { type: Number, default: 0 },
    grade_c: { type: Number, default: 0 },
    grade_skipped: { type: Number, default: 0 },
    grade_pending: { type: Number, default: 0 },
  },
});

const reportTotalSchema = new Schema({
  data: {
    total_initial: {
      user_totals: {
        users: { type: Number, default: 0 },
        owners: { type: Number, default: 0 },
        employees: { type: Number, default: 0 },
        managers: { type: Number, default: 0 },
        approvers: { type: Number, default: 0 },
      },
      document_totals: {
        documents: { type: Number, default: 0 },
        policies: { type: Number, default: 0 },
        incidents: { type: Number, default: 0 },
        verbals: { type: Number, default: 0 },
        writtens: { type: Number, default: 0 },
        pips: { type: Number, default: 0 },
        signature_requested: { type: Number, default: 0 },
        signed: { type: Number, default: 0 },
      },
      verbal_totals: {
        verbals: { type: Number, default: 0 },
      },
      written_totals: {
        writtens: { type: Number, default: 0 },
        signature_requests: { type: Number, default: 0 },
        signed: { type: Number, default: 0 },
      },
      pip_totals: {
        pips: { type: Number, default: 0 },
        signature_requests: { type: Number, default: 0 },
        signed: { type: Number, default: 0 },
      },
      folder_totals: {
        folders: { type: Number, default: 0 },
      },
      feed_totals: {
        feeds: { type: Number, default: 0 },
      },
      policy_totals: {
        policies: { type: Number, default: 0 },
        policies_started: { type: Number, default: 0 },
        policies_completed: { type: Number, default: 0 },
        policies_approved: { type: Number, default: 0 },
        policies_sent: { type: Number, default: 0 },
        signature_requests: { type: Number, default: 0 },
        signed: { type: Number, default: 0 },
      },
      termination_totals: {
        terminations: { type: Number, default: 0 },
      },
      ticket_totals: {
        tickets: { type: Number, default: 0 },
        tickets_closed: { type: Number, default: 0 },
        tickets_open: { type: Number, default: 0 },
      },
      signature_totals: {
        signature_requests: { type: Number, default: 0 },
        signed: { type: Number, default: 0 },
      },
      resignation_totals: {
        resignations: { type: Number, default: 0 },
      },
      audit_totals: {
        audits: { type: Number, default: 0 },
        audits_completed: { type: Number, default: 0 },
      },
      employee_totals: {
        employees_onboarding_sent: { type: Number, default: 0 },
        employees_not_invited: { type: Number, default: 0 },
        employees_signed_up: { type: Number, default: 0 },
      },
      companies_active: { type: Number, default: 0 },
      companies_contacted: { type: Number, default: 0 },
      companies_leads: { type: Number, default: 0 },
      companies_employees_invited: { type: Number, default: 0 },
      companies_employees_not_invited: { type: Number, default: 0 },
      companies_onboarded: { type: Number, default: 0 },
      companies_onboarding_required: { type: Number, default: 0 },
      companies_with_employees: { type: Number, default: 0 },
      companies_without_employees: { type: Number, default: 0 },
      companies_without_policies: { type: Number, default: 0 },
      companies_with_policies_approved: { type: Number, default: 0 },
      companies_with_policies_sent: { type: Number, default: 0 },
      companies_with_policies_in_flight: { type: Number, default: 0 },
      companies_with_all_policies_signed: { type: Number, default: 0 },
      companies_with_one_policy_signed: { type: Number, default: 0 },
      companies_with_no_policies_signed: { type: Number, default: 0 },
      companies_with_todos: { type: Number, default: 0 },
      companies_without_todos: { type: Number, default: 0 },
    },
    by_company: [byCompanySchema],
  },
});

module.exports = reportTotalSchema;
