const { Schema } = require('mongoose');

const changeLogSchema = new Schema({
  field: { type: String, required: true },
  oldValue: { type: Schema.Types.Mixed, required: true },
  newValue: { type: Schema.Types.Mixed, required: true },
  updatedDate: { type: Date, required: true },
  performedBy: { type: Schema.Types.ObjectId, required: true },
});

const cancellationSchema = new Schema(
  {
    _company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    _customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    _requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    _closedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    _ae: { type: Schema.Types.ObjectId, ref: 'User' },
    _hrm: { type: Schema.Types.ObjectId, ref: 'User' },
    _obs: { type: Schema.Types.ObjectId, ref: 'User' },

    status: {
      type: String,
      enum: ['pending', 'cancelled', 'rescued'],
      default: 'pending',
    },
    source: {
      type: String,
      enum: ['web', 'email', 'phone', 'chat', 'internal', ''],
      default: '',
    },
    createdDate: { type: Date, default: Date.now },
    requestedDate: { type: Date, default: Date.now },
    closedDate: { type: Date, default: null },
    effectiveDate: { type: Date, default: null },
    reasonCodes: {
      type: [Number],
      set: function (reasonCodes) {
        const isArray = Array.isArray(reasonCodes);

        return isArray ? reasonCodes : [reasonCodes];
      },
    },
    rebuttalReasonCode: { type: Number },
    clientReasonNote: { type: String, default: '' },
    internalReasonNote: { type: String, default: '' },
    closingNote: { type: String, default: '' },
    refundAmount: { type: Number, default: 0 },
    reinstatementAmount: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    creditMonths: { type: Number, default: 0, min: 0, mx: 12 },
    affectedCompanies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    multiAccount: { type: Boolean, default: false },
    isTrialCancellation: { type: Boolean, default: false },

    changeLogs: [changeLogSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

cancellationSchema.methods.updateReasonCodes = function (reasonCodes, performedById) {
  const oldValue = this.reasonCodes;

  this.reasonCodes = reasonCodes;

  this.addChangeLog('reasonCodes', oldValue, this.reasonCodes, performedById);
};

cancellationSchema.methods.addChangeLog = function (field, oldValue, newValue, performedBy) {
  const log = {
    field,
    oldValue,
    newValue,
    performedBy,
    updatedDate: Date.now(),
  };

  this.changeLogs.push(log);
};

cancellationSchema.methods.isClosed = function () {
  return this.status === 'cancelled' || this.status === 'rescued';
};

module.exports = cancellationSchema;
