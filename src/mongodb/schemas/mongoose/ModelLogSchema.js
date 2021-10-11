const { Schema } = require('mongoose');
const { transform, isEqual, isObject } = require('lodash');

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key]))
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
  });
}

const ModelLogSchema = new Schema({
  model: {
    _data: { type: Schema.Types.ObjectId, index: true },
    ref: { type: String },
  },

  log_data: { type: Schema.Types.Mixed },
  diff: { type: Schema.Types.Mixed },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
});

ModelLogSchema.pre('save', function () {
  this.updated_at = new Date();
});

ModelLogSchema.statics.createLog = async function (modelRef, modelId, data) {
  const doc = await this.findOne({ 'model.ref': modelRef, 'model._data': modelId }).sort('-created_at');

  const base = doc && doc.log_data ? JSON.parse(JSON.stringify(doc.log_data)) : {};
  const target = JSON.parse(JSON.stringify(data));

  if (doc)
    try {
      const diff = difference(target, base);
      return this.create({
        model: {
          ref: modelRef,
          _data: modelId,
        },
        log_data: {
          ...target,
        },
        diff: {
          ...diff,
        },
      });
    } catch (e) {
      //logger.error('error', e)
    }
  else
    try {
      return this.create({
        model: {
          ref: modelRef,
          _data: modelId,
        },
        log_data: {
          ...data,
        },
      });
    } catch (e) {
      //logger('error', e)
    }
};

module.exports = ModelLogSchema;
