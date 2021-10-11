const { Schema } = require('mongoose');

const roadmapStepSchema = new Schema(
  {
    name: { type: String, required: true },

    active: { type: Boolean, default: false },
    complete: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },

    data: { type: Schema.Types.Mixed },
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

module.exports = roadmapStepSchema;
