/**
 * Created by foureight84 on 6/13/17.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const filestack = require('./FilestackSchema');
const DeletedSchema = require('./lib/DeletedSchema');

const folderSchema = new Schema({
  doc_type: {
    type: String,
    enum: [
      'cap',
      'termination',
      'onboard',
      'generic_file',
      'resume',
      'job_description',
      'employee_agreement',
      'government_forms',
      'employee_handbook',
      'policies',
      'harassment',
      'hipaa_notice',
      'employee_notice',
      '',
    ],
    default: 'generic_file',
  },

  doc_content: {
    model: String,
    _item: { type: Schema.Types.ObjectId, refPath: 'doc_content.model' },
  },

  files: [filestack],

  _user: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null, required: true, index: true },
  _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null, required: true, index: true },

  visibility: {
    byEmployee: { type: Boolean, default: false },
    byManager: { type: Boolean, default: false },
    byUser: { type: Boolean, default: true },
  },

  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },

  deletion: { type: DeletedSchema },
});

folderSchema.index({
  _user: 1,
  'doc_content.model': 1,
  active: 1,
});

folderSchema.pre('save', function () {
  this.modified_at = new Date();
});

module.exports = folderSchema;
