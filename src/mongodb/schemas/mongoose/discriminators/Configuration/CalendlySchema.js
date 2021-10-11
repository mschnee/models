const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendlySchema = new Schema({
  covidEventType: { type: String },
  followUpEventType: { type: String },
  hrGeneralEventType: { type: String },
  insuranceOverviewEventType: { type: String },
  personalInsuranceOverviewEventType: { type: String },
  upsellEventType: { type: String },
  salesEventType: { type: String },
  insuranceTeamUuid: { type: String },
  transitionTeamUuid: { type: String },
  upsellTeamUuid: { type: String },
});

module.exports = calendlySchema;
