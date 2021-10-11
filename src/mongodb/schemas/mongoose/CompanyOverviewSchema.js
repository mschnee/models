const { Schema } = require('mongoose');

const policyDocumentsSchema = new Schema({
  name: { type: String, default: '' },
  hidden: { type: Boolean, default: false },
  completion_estimate: {
    type: Date,
    default: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  },
  states: {
    consultation: {
      active: { type: Boolean, default: true },
      complete: { type: Boolean, default: false },
    },
    draft: {
      active: { type: Boolean, default: false },
      complete: { type: Boolean, default: false },
    },
    document_ready: {
      active: { type: Boolean, default: false },
      complete: { type: Boolean, default: false },
      file: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    },
  },
});

const companyOverviewSchema = new Schema({
  initial_call: {
    hidden: { type: Boolean, default: false },
    scheduled: { type: Boolean, default: false },
    schedule: { type: Schema.Types.Mixed },
  },
  internal_policy_audit: { type: Boolean, default: false },
  policy_documents: {
    hidden: { type: Boolean, default: false },
    complete: { type: Boolean, default: false },
    policies: [policyDocumentsSchema],
  },
});
// const defaultCompanyOverview = {
//   initial_call: {
//     hidden: false,
//     scheduled: false,
//     schedule: {}
//   },
//   account_setup: {
//     company_information: false,
//     policy_information: false,
//     billing_information: false
//   },
//   internal_policy_audit: false,
//   policy_documents: {
//     hidden: false,
//     complete: false,
//     policies: []
//   }
// }

module.exports = companyOverviewSchema;
