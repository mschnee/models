const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verbalWarningSchema = new Schema(
  {
    legacy_id: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _document: { type: Schema.Types.ObjectId, ref: 'Document', index: true },

    wizard: {
      performance_concerns_type: { type: String, default: '' },
      performance_concerns_info: { type: String, default: '' },
      consequences: [
        {
          text: { type: String, default: '' },
          info: { type: String, default: '' },
        },
      ],
      completed_steps: [Schema.Types.Mixed],
    },

    notes: [
      {
        key: { type: String, default: '' },
        note: { type: String, default: '' },
        user: { type: Schema.Types.Mixed, default: '' },
        date: { type: Date, default: Date.now },
      },
    ],

    status: { type: String, default: 'draft' },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJson: { virtuals: true },
  },
);

verbalWarningSchema.virtual('_feed', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_data',
  justOne: true,
});

verbalWarningSchema.methods.eventData = async function () {
  await this.populate('employee').execPopulate();

  return {
    _id: this._id,
    employee: await this.employee.eventData(),
    type: 'Verbal Warning',
    status: this.status,
    created_at: this.created_at,
  };
};

module.exports = verbalWarningSchema;
