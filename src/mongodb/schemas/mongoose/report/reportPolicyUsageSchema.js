const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countSchema = new Schema(
  {
    name: String, //report name
    count: Number,
  },
  { _id: false },
);

const byCompanyDataSchema = new Schema(
  {
    name: { type: String }, //report name
    count: { type: Number, default: 0 },
  },
  { _id: false },
);

const byCompanySchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    name: String, //company name
    data: [byCompanyDataSchema],
  },
  { _id: false },
);

const reportPolicyUsageSchema = new Schema({
  data: {
    count: [countSchema],
    byCompany: [byCompanySchema],
  },
});

module.exports = reportPolicyUsageSchema;
