const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personaCreatedSchema = new Schema({
  data: {
    persona: {
      difficulty: { type: Number, default: null },
      expectations: { type: Number, default: null },
      helpRequired: { type: Number, default: null },
    },
  },
});

module.exports = personaCreatedSchema;
