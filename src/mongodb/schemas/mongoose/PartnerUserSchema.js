const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    first_name: { type: String, trim: true, default: '' },
    last_name: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
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
    return this.first_name + ' ' + this.last_name;
  })
  .set((v) => {
    this.first_name = v.substr(0, v.indexOf(' '));
    this.last_name = v.substr(v.indexOf(' ') + 1);
  });

const partnerUserSchema = new Schema(
  {
    _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
    email: { type: String, lowercase: true, trim: true },
    partner_code: { type: String, default: '' },
    partner_type: { type: String, enum: ['', 'partner', 'ambassador'], default: '' },
    profile: {
      type: profileSchema,
      default: {},
    },
    states: {
      demo_account_created: { type: Boolean, default: false },
      active: { type: Boolean, default: true },
    },
    password: { type: String, trim: true },
    token: {
      active: { type: Boolean, default: false },
      text: { type: String, default: '' },
      generated_at: { type: Date, default: Date.now },
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: function (doc, ret, options) {
        delete ret.password;

        return ret;
      },
      virtuals: true,
    },
    minimize: false,
  },
);

partnerUserSchema.methods.eventData = function () {
  return {
    _id: this._id,
    email: this.email,
    partner_type: this.partner_type,
    profile: this.profile.toObject(),
  };
};

module.exports = partnerUserSchema;
