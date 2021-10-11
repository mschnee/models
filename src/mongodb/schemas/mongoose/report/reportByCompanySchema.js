const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const byCompany = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    companyName: { type: String },
    count: { type: Number, default: 0 },
  },
  {
    _id: false,
  },
);

const reportByCompanySchema = new Schema({
  data: { type: [byCompany], default: [] },
});

module.exports = reportByCompanySchema;
