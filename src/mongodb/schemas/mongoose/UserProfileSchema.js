const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencySchema = require('./EmergencySchema');

function setFirstName(val) {
  if (val !== null) return val;

  return this.first_name;
}
function setLastName(val) {
  if (val !== null) return val;

  return this.last_name;
}

function dollarTrim(val) {
  if (typeof val == 'string' && val.trim().includes('$')) return val.trim().substring(1);
  return val;
}

const profileSchema = new Schema(
  {
    first_name: { type: String, trim: true, default: '', set: setFirstName },
    last_name: { type: String, trim: true, default: '', set: setLastName },
    supervisor: { type: String, trim: true },
    role: { type: String, trim: true, index: true },
    phone: {
      type: String,
      trim: true,
      default: '',
      set: (val) => (val ? val.replace(/[\s()-]/gi, '') : ''),
      index: true,
    },
    type: { type: String, enum: ['', 'hourly', 'salary', 'contractor'], default: '' },
    employee_type: { type: String, enum: ['', 'parttime', 'fulltime', 'contractor'], default: '' },
    pay_rate: { type: String, trim: true, set: dollarTrim },
    pay_day: { type: String, default: '' },
    pay_frequency: { type: String, default: '' },
    hours_per_week: { type: String, trim: true },
    start_date: { type: String, trim: true },
    address: { type: String, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    state_work_in: { type: String, trim: true },
    dob: { type: Date, default: null },
    lastSocial: { type: String, default: '' },
    avatar_url: { type: String, default: '' },
    years_experience: { type: String, default: '' },
    contractor: { type: Boolean, default: false },
    _partner: { type: Schema.Types.ObjectId, ref: 'PartnerUser', default: null },
    conference: { type: String, default: '' },
    emergency_contact: {
      type: emergencySchema,
      default: {},
    },
    timezone: { type: String, default: '' },
    contractor_business_name: { type: String, default: null },
    contractor_type: { type: String, enum: ['individual', 'business'] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
    id: false,
  },
);

profileSchema
  .virtual('full_name')
  .get(function () {
    return (this.first_name + ' ' + this.last_name).trim();
  })
  .set(function (v) {
    if (!v) return;

    this.first_name = v.substr(0, v.indexOf(' '));
    this.last_name = v.substr(v.indexOf(' ') + 1);
  });

module.exports = profileSchema;
