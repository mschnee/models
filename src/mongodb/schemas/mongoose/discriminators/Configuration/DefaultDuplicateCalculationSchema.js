const { Schema } = require('mongoose');

const defaultDuplicateCalculationSchema = new Schema(
  {
    name: { type: String, default: '' },
    script: {
      companyNameMatchThreshold: { type: Number, default: 0 },
    },
    calculation: {
      companyName: { type: Number, default: 0 },
      companyPhone: { type: Number, default: 0 },
      owner: { type: Number, default: 0 },
      ownerPhone: { type: Number, default: 0 },
      email: { type: Number, default: 0 },
      industry: { type: Number, default: 0 },
      zip: { type: Number, default: 0 },
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

defaultDuplicateCalculationSchema.virtual('formatted').get(function () {
  return {
    script: {
      companyNameMatchThreshold: this.script.companyNameMatchThreshold / 100,
    },
    calculation: {
      companyName: this.calculation.companyName / 100,
      companyPhone: this.calculation.companyPhone / 100,
      owner: this.calculation.owner / 100,
      ownerPhone: this.calculation.ownerPhone / 100,
      email: this.calculation.email / 100,
      industry: this.calculation.industry / 100,
      zip: this.calculation.zip / 100,
    },
  };
});

module.exports = defaultDuplicateCalculationSchema;
