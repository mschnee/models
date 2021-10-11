const { Schema } = require('mongoose');

const overDocumentSchema = new Schema({
  doc_type: {
    type: String,
    enum: ['harassment', 'employee_handbook', 'employee_agreement', 'hipaa_notice', 'employee_notice'],
  },
  _file: { type: Schema.Types.ObjectId, ref: 'File', default: null },
});

module.exports = overDocumentSchema;
