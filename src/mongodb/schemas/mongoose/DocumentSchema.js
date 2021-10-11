const mongoose = require('mongoose');
const DeletedSchema = require('./lib/DeletedSchema');
const Schema = mongoose.Schema;

// this signature schema captures the signature itself
const signatureSchema = require('./SignatureSchema');
const tokenSchema = require('./TokenSchema');

// This originalContactSchema links a User who is supposed to be able to view the document.
const originalContactSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  email: { type: String, default: null },
  pandaContactId: { type: String, default: null },
});

const documentSchema = new Schema(
  {
    _employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _created_by: { type: Schema.Types.ObjectId, ref: 'User', index: true },

    type: { type: String, default: 'none' },
    originRef: { type: Schema.Types.ObjectId, refPath: 'type' },

    name: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },

    html: { type: String },
    editor: { type: String, enum: [null, 'quill', 'ckeditor'], default: null },
    version: { type: Number, default: 1 },

    signature: { type: signatureSchema },
    manager_signature: { type: signatureSchema },
    signed_token: { type: tokenSchema, default: {} },

    signed: { type: Boolean, default: false },
    signed_on: { type: Date, default: null },
    manager_signed: { type: Boolean, default: false },
    manager_signed_on: { type: Date, default: null },
    signature_required: { type: Boolean, default: false },
    manager_signature_required: { type: Boolean, default: false },

    signature_contact: { type: originalContactSchema },
    manager_signer_contact: { type: originalContactSchema },

    panda: {
      id: { type: String, index: true },
      status: { type: String },
      preview: {
        id: { type: String },
        expires_at: { type: Date },
      },
    },

    deletion: { type: DeletedSchema },

    retraction: {
      retraction_date: { type: Date },
      retracted_by: { type: Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, maxlength: 300 },
    },

    outdated: {
      outdated_date: { type: Date },
      outdated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    },

    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
  },
);

documentSchema.virtual('_feed', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_data',
  justOne: true,
});

documentSchema.virtual('_policy', {
  ref: 'Policy',
  localField: '_id',
  foreignField: '_documents',
  justOne: true,
});

documentSchema.virtual('pip', {
  ref: 'Pip',
  localField: '_id',
  foreignField: '_document',
  justOne: true,
});

documentSchema.virtual('written_warning', {
  ref: 'Writtenwarning',
  localField: '_id',
  foreignField: '_document',
  justOne: true,
});

documentSchema.virtual('verbal_warning', {
  ref: 'Verbalwarning',
  localField: '_id',
  foreignField: '_document',
  justOne: true,
});

documentSchema.virtual('isRetracted', function () {
  return this.retraction && this.retraction.retraction_date;
});

documentSchema.methods.generateSignedToken = function () {
  if (this.signed_token.token) throw new Error('Document already signed');

  const hash = {
    html: this.html,
    signature: this.signature,
  };

  this.signed_token.generateJWT(hash, 'test'); //TODO: decide secret
};

documentSchema.methods.eventData = async function () {
  if (!this.populated('_employee')) await this.populate('_employee').execPopulate();

  return {
    _id: this._id,
    _employee: await this._employee.eventData(),
    type: 'Document',
    created_at: this.created_at,
  };
};

documentSchema.methods.rename = function (name) {
  if ((this.signature_required && this.signed) || (this.manager_signature_required && this.manager_signed))
    throw new Error("Signed document can't be renamed");

  this.name = name;
};

module.exports = documentSchema;
