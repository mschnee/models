const { isArray } = require('lodash');
const convertBool = (val) => (val === true ? 'Yes' : val === false ? 'No' : null);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  question_index: Number,
  complete: Boolean,
  disabled: Boolean,
  progress: Number,
});

const qnaSchema = new Schema(
  {
    _created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
    _user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, default: 'New QNA' },
    type: {
      type: String,
      default: '',
      required: true,
      enum: [
        'Audit',
        'CompanyOverview',
        'InsuranceOverview',
        'SalesHrAudit',
        'BasicAudit',
        'PayrollEligibility',
        'WelcomeAudit',
      ],
    },
    surveySystem: { type: String, default: 'bambee', enum: ['bambee', 'surveyjs'] },
    typeVersion: { type: Number, required: true, default: 1 },
    questions: [{ type: Schema.Types.Mixed }],
    answers: { type: Schema.Types.Mixed },
    progress: { type: progressSchema },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
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

qnaSchema.index({
  _company: 1,
});

qnaSchema.virtual('_insuranceEvent', {
  ref: 'InsuranceInterest',
  localField: '_company',
  foreignField: '_company',
  justOne: true,
  options: {
    sort: {
      created_at: -1,
    },
  },
});

qnaSchema.pre('save', function () {
  this.modified_at = new Date();
});

qnaSchema.methods.setFromCompanyData = function (company, extras = {}) {
  this.answers = this.answers || {};

  for (const [key, value] of Object.entries(this.answers)) {
    if (value === null || (isArray(value) && value.length === 0)) delete this.answers[key];
  }

  switch (this.type) {
    case 'CompanyOverview':
      this.prefillCompanyOverview(company, extras);
      break;

    case 'InsuranceOverview':
      this.prefillInsuranceOverview(company);
      break;
    case 'Audit':
      this.prefillAudit(company, extras);
      break;
    case 'SalesHrAudit':
      // This audit does not need prefilling
      this.initializeSalesHrAudit();
      break;
  }
};

qnaSchema.methods.prefillCompanyOverview = function (company, { industries = [] }) {
  const { profile } = company;
  const industry = _findIndustry(profile.industry, industries);

  this.answers = {
    legalName: company.name,
    dba: profile.dba,
    industry: industry ? [industry.value] : [],
    hasCommissionWorkers: convertBool(profile.has_commissioned_workers),
    ...this.answers,
  };

  this.answers.companyAddress = this.answers.companyAddress || {};
  this.answers.companyAddress = {
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zip: profile.zip,
    ...this.answers.companyAddress,
  };
};

qnaSchema.methods.prefillInsuranceOverview = function (company) {
  const {
    self_reported_insurance,
    self_reported_policies = [],
    self_reported_insurance_carrier,
    self_reported_insurance_brokerage,
    self_reported_insurance_agent,
    self_reported_filed_bankruptcy,
    self_reported_open_investigations,
    self_reported_owned_vehicles,
    self_reported_owned_office_space,
  } = company;
  const insuranceLines = Object.keys(self_reported_insurance);

  const initialAnswers = {
    selfReportedLinesOfInsurance: {},
    reportedInsuranceBrokerage:
      self_reported_insurance_brokerage === `I don't know`
        ? { brokerage: '', unknown: true }
        : { brokerage: self_reported_insurance_brokerage, unknown: false },
    insuranceAgentInput:
      self_reported_insurance_agent === `I don't know`
        ? { agent: '', unknown: true }
        : { agent: self_reported_insurance_agent, unknown: false },
    selfReportedFiledBankruptcy: convertBool(self_reported_filed_bankruptcy),
    selfReportedOpenInvestigations: convertBool(self_reported_open_investigations),
    selfReportedHasBusinessOwnedVehicles: convertBool(self_reported_owned_vehicles),
    selfReportedOwnsOfficeSpace: convertBool(self_reported_owned_office_space),
  };

  for (const key in insuranceLines) {
    switch (key) {
      case 'workers':
        initialAnswers.selfReportedLinesOfInsurance['Workers Compensation'] = {
          has: self_reported_insurance[key],
          carrier: self_reported_insurance_carrier[key],
        };
        break;
      case 'pro_liab':
        initialAnswers.selfReportedLinesOfInsurance['Professional Liability'] = {
          has: self_reported_insurance[key],
          carrier: self_reported_insurance_carrier[key],
        };
        break;
      case 'epli':
        initialAnswers.selfReportedLinesOfInsurance['Employment Practices Liability'] = {
          has: self_reported_insurance[key],
          carrier: self_reported_insurance_carrier[key],
        };
        break;
      case 'cyber':
        initialAnswers.selfReportedLinesOfInsurance['Cyber Liability'] = {
          has: self_reported_insurance[key],
          carrier: self_reported_insurance_carrier[key],
        };
        break;
      case 'general':
        initialAnswers.selfReportedLinesOfInsurance['General Liability'] = {
          has: self_reported_insurance[key],
          carrier: self_reported_insurance_carrier[key],
        };
        break;
    }
  }

  if (
    self_reported_policies.length > 0 &&
    Array.isArray(initialAnswers.selfReportedLinesOfInsurance) &&
    initialAnswers.selfReportedLinesOfInsurance.length === 0
  ) {
    initialAnswers.selfReportedLinesOfInsurance = [];
    for (const policy of self_reported_policies) {
      initialAnswers.selfReportedLinesOfInsurance.push({
        name: policy.name,
        carrier: policy.carrier,
      });
    }
  }

  this.answers = {
    ...initialAnswers,
    ...this.answers,
  };
};

qnaSchema.methods.prefillAudit = function (company, { industries = [] }) {
  const getYesNoNotSure = function (val) {
    if (val == null) {
      return `I'm not sure`;
    }
    return val ? 'Yes' : 'No';
  };

  const { profile, self_reported_insurance } = company;
  const industry = _findIndustry(profile.industry, industries);

  const initialAnswers = {
    legal_name: company.name,
    zip: profile.zip,
    federal_contractor: getYesNoNotSure(profile.is_federal_contractor),
    industry: industry ? [industry.value] : [],
    revenue: profile.estimated_annual_revenue,
    independent_contractor: profile.num_of_contractors > 0 ? 'Yes' : 'No',
    independent_contractor_count: profile.num_of_contractors,
    total_payroll: profile.estimated_monthly_payroll * 12,
    have_gen_liab_insurance: getYesNoNotSure(self_reported_insurance.general),
    have_epli: getYesNoNotSure(self_reported_insurance.epli),
    have_pro_liab_insurance: getYesNoNotSure(self_reported_insurance.pro_liab),
    have_cyber_liab_insurance: getYesNoNotSure(self_reported_insurance.cyber),
    have_wc_insurance: getYesNoNotSure(self_reported_insurance.workers),
  };

  if (this.typeVersion === 2) {
    const numToString = (val) => (val === null ? val : `${val}`);
    initialAnswers.num_of_employees = numToString(
      profile.num_of_full_time_salary_employees +
        profile.num_of_full_time_hourly_employees +
        profile.num_of_contractors +
        profile.num_of_part_time_employees,
    );
    initialAnswers.pt_employees = numToString(profile.num_of_part_time_employees);
    initialAnswers.ft_employees = numToString(profile.num_of_full_time_salary_employees);
    initialAnswers.hrly_employees = numToString(profile.num_of_full_time_hourly_employees);
    initialAnswers.slry_employees = numToString(profile.num_of_full_time_salary_employees);
    initialAnswers.have_handbook = getYesNoNotSure(profile.customer_provided_handbook);
    initialAnswers.onboarding_paperwork_handbook = getYesNoNotSure(profile.customer_provided_handbook);
  } else if (this.typeVersion === 3) {
    initialAnswers.employeeBreakdown = {
      numOfPartTimeEmployees: company.profile.num_of_part_time_employees,
      numOfFullTimeSalaryEmployees: company.profile.num_of_full_time_salary_employees,
      numOfFullTimeHourlyEmployees: company.profile.num_of_full_time_hourly_employees,
      numOfContractors: company.profile.num_of_contractors,
    };
  }

  this.answers = {
    ...initialAnswers,
    ...this.answers,
  };
};

qnaSchema.methods.initializeSalesHrAudit = function () {
  this.answers = {
    hasSexualHarassmentPolicy: null,
    hasHandbook: null,
    handbookLastUpdated: '',
    hasPolicies: null,
    policiesLastUpdated: '',
    hasI9sForAllEmployees: null,
    hasLaborPosters: null,
    providesOfferLetters: null,
    hasEmployeeFiles: null,
    digitalOrPhysical: '',
    hasWorkersCompensation: null,
    hasJobDescriptions: null,
    employeeCityAndStates: '',
    documentsVerbalAndWrittenwarnings: null,
    handleDisciplinaryIssues: '',
    hadPerformanceIssue: null,
    providesTerminationRequirements: null,
    hasTerminatedEmployee: null,
    providesAnnualReviewsForEmployees: null,
    ...this.answers,
  };
};

module.exports = qnaSchema;

function _findIndustry(value, industries) {
  return industries.find((industry) => industry.value === value || industry.alias === value);
}
