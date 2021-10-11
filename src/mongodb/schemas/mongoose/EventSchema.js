const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    _user: { type: Schema.Types.ObjectId, ref: 'User', index: true }, //for what user
    _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true }, //for what company
    source_user: { type: Schema.Types.Mixed, required: false }, //who did it
    data: { type: Schema.Types.Mixed },

    created_at: { type: Date, default: Date.now, index: true },
  },
  {
    discriminatorKey: 'kind',
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

eventSchema
  .virtual('current_user')
  .get(function () {
    return this.source_user;
  })
  .set(function (val) {
    this.source_user = val;
  });

eventSchema.index({ kind: 1 });
eventSchema.index({ kind: 1, _company: 1 });
eventSchema.index({ company: 1 });
eventSchema.index({
  kind: 1,
  created_at: -1,
});
// eventSchema.index({ _user: 1, name: 1, created_at: -1 })

/*eventSchema.virtual('company_id').get(function () {
  const company = this.current_user._company

  if (!company) return

  if (company instanceof mongoose.Types.ObjectId) return company

  return company._id
})*/

module.exports = eventSchema;
