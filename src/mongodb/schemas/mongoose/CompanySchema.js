const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _ = require('lodash');
const UIDGenerator = require('uid-generator');

const callSchema = require('./company/CallSchema');
const insuranceSalesCall = require('./company/InsuranceSalesCallSchema');
const salesCall = require('./company/SalesCallSchema');
const overDocumentSchema = require('./company/OverDocumentSchema');
const noteSchema = require('./company/NoteSchema');
const roadmapStepSchema = require('./company/RoadmapStepSchema');
const companyOverviewSchema = require('./CompanyOverviewSchema');
const { reportCardsCadence } = require('../../constants/reportCards');

const { Schema } = mongoose;
const uidgen = new UIDGenerator(32);

const STRIPE_PAUSED_PLAN_PATTERN = /^pause/i;
const default_roadmap_states = function () {
  const initial_call = {
    name: 'initial call',
    active: false,
    complete: false,
    hidden: true,
    data: {
      schedule: null,
      phone: null,
    },
  };

  const account_setup = {
    name: 'account setup',
    active: true,
    complete: false,
    hidden: false,
    data: {
      company_information: false,
      policy_information: false,
      billing_information: false,
    },
  };

  const platform_training = {
    name: 'platform training',
    active: false,
    complete: false,
    hidden: true,
    data: {
      schedule: null,
      phone: null,
    },
  };

  const hr_audit = {
    name: 'hr audit',
    active: false,
    complete: false,
    hidden: true,
    data: {
      schedule: null,
      phone: null,
    },
  };

  const staff_folders = {
    name: 'staff folders',
    active: true,
    complete: false,
    hidden: false,
    data: {
      folders_created: false,
      uploaded_csv: [],
    },
  };

  const policies = {
    name: 'policies',
    active: false,
    complete: false,
    hidden: false,
    data: {
      folders_created: false,
      uploaded_csv: null,
    },
  };

  const handbook = {
    name: 'handbook',
    active: false,
    complete: false,
    hidden: true,
    data: {
      handbook_file: null,
    },
  };

  return [initial_call, account_setup, platform_training, hr_audit, staff_folders, policies, handbook];
};

const getMostRecentOverviewCall = (salesCalls) => {
  const ovCalls = salesCalls.filter((c) => c.kind == 'overview-call');
  return _.maxBy(ovCalls, 'created_at');
};

const getMostRecentCallByKind = (salesCalls, kind) => {
  const calls = salesCalls.filter((c) => c.kind == kind);
  return _.maxBy(calls, 'created_at');
};

const insurancePolicySchema = new Schema({
  name: { type: String, default: '' },
  carrier: { type: String, default: '' },
});

const companySchema = new Schema(
  {
    legacy_id: { type: String, default: '' },
    unique_url_id: { type: String, default: null, lowercase: true },
    name: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: ['lead', 'trial', 'paying', 'inactive'],
      default: 'lead',
    },
    profile: {
      industry: { type: String, default: '' },
      subIndustry: { type: String, default: '' },
      num_of_employees: { type: String, default: '' },
      address: { type: String, default: '' },
      address2: { type: String, default: '' },
      zip: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      geo: {
        place: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        types: { type: [String] },
        tzId: { type: String },
        tzOffset: { type: Number },
      },
      phone: {
        type: String,
        default: '',
        set: (val) => (val ? val.replace(/[\s()-]/gi, '') : ''),
      },
      reported_owner_name: { type: String, default: '' },
      logo_url: { type: String, default: '' },
      payday: { type: String, default: 'Friday' },
      payday_schedule: { type: [Number], default: null },
      pay_frequency: { type: String, default: 'Bi-weekly' },
      dba: { type: String, default: '' },
      location_name: { type: String, default: '' },
      isFranchiseOwner: { type: Boolean, default: null },
      hasEverExpressedInsuranceInterest: { type: Boolean, default: false },
      firstInsuranceInterestDate: { type: Date, default: null },
      firstInsuranceInterestReferrer: { type: String, default: null },
      firstInsuranceInterestSource: { type: String, default: null },
      insuranceInterest: { type: String, default: 'unknown', lowercase: true, trim: true },
      insuranceInterestLines: { type: [String] },
      rehirePolicies: { type: Boolean, default: false },
      incorporated_in: { type: String, default: '' },
      established_in: { type: String, default: '' },
      is_federal_contractor: { type: Boolean, default: null },
      fein: { type: String, default: '' },
      corporation_type: { type: String },
      has_commissioned_workers: { type: Boolean, default: null },
      num_of_full_time_hourly_employees: { type: Number, default: null },
      num_of_full_time_salary_employees: { type: Number, default: null },
      num_of_part_time_employees: { type: Number, default: null },
      num_of_contractors: { type: Number, default: null },
      estimated_annual_revenue: { type: Number, default: 0 },
      estimated_monthly_payroll: { type: Number, default: 0 },
      customer_provided_handbook: { type: Boolean, default: false },
    },

    self_reported_insurance: {
      general: { type: Boolean, default: null },
      epli: { type: Boolean, default: null },
      pro_liab: { type: Boolean, default: null },
      cyber: { type: Boolean, default: null },
      workers: { type: Boolean, default: null },
    },
    self_reported_insurance_carrier: {
      general: { type: String, default: '' },
      epli: { type: String, default: '' },
      pro_liab: { type: String, default: '' },
      cyber: { type: String, default: '' },
      workers: { type: String, default: '' },
    },
    self_reported_policies: [insurancePolicySchema],
    self_reported_insurance_brokerage: { type: String, default: null },
    self_reported_insurance_agent: { type: String, default: null },
    self_reported_filed_bankruptcy: { type: Boolean, default: null },
    self_reported_open_investigations: { type: Boolean, default: null },
    self_reported_owned_vehicles: { type: Boolean, default: null },
    self_reported_owned_office_space: { type: Boolean, default: null },
    plan: {
      type: String,
      // enum: [
      //   'single',
      //   '25',
      //   '20',
      //   '50',
      //   '150',
      //   '20y',
      //   '50y',
      //   '150y',
      //   '5m19q3', //not real but in db
      //   '4m19q3',
      //   '4y19q3',
      //   '19m19q3',
      //   '19y19q3',
      //   '49m19q3',
      //   '49y19q3',
      //   '99m19q3',
      //   '99y19q3',
      //   'plan_Ew5B94b5KUx6ro', // Monthly 21-49 (legacy custom) $159/mo
      //   'plan_EIk2DY41YqGlZK', // Monthly 1-20 (custom) $75/mo
      //   '849_monthly', // Monthly 50-99 (custom) $849/mo
      //   '549_monthly', // Monthly $549
      //   'plan_DDzkwprULIwE5H', // Monthly $99/mo 1-20 w/ 7 day trial
      //   '50_30_day_trial', // Monthly $199/mo 21-49 w/ 30 day trial
      //   '20_30_day_trial', // Monthly $99/mo 1-20 w/ 30 day trial
      // ],
      // default: '4m19q3'
    },

    stripe: {
      totalCharges: { type: Number, default: 0 },
      couponId: { type: String, default: null },
      original_payment_date: { type: Date },
      expected_payment_date: { type: Date },
      attempt_count: { type: Number },

      setupFeeInvoiceItemId: { type: String }, // invoice_item.id
      setupFeeAmount: { type: Number }, // invoice_item.amount
      emergencyFeeAmount: { type: Number }, // hrEmergencyFeeInvoice.amount

      customerId: { type: String }, // customer.id
      customerEmail: { type: String }, // customer.email
      delinquent: { type: Boolean }, // customer.delinquent
      predelinquent: { type: Boolean }, // set X days ahead of a renewal, so we can notify user about potential issues with card

      subscriptionId: { type: String }, // subscription.id
      subscribedAt: { type: String }, // subscription.created
      planAmount: { type: Number }, // subscription.plan.amount
      planInterval: { type: String }, // subscription.plan.interval
      currentPeriodStart: { type: Date }, // subscirption.current_period_start
      currentPeriodEnd: { type: Date }, // subscription.current_period_end

      defaultCard: {
        stripeId: { type: String },
        last4: { type: String },
        expireMonth: { type: Number },
        expireYear: { type: Number },
        brand: { type: String },
      },
    },

    trial: {
      eligible: { type: Boolean, default: false }, // if company is eligible for trial promo
      trialDuration: { type: Number }, // trial duration expressed in number of days
      trialStartDate: { type: Date }, // the date trial actually started
      trialEndingDate: { type: Date }, // the date the trial promo ends (or already ended)
      trialCancellationRequestedDate: { type: Date },
      setupFeeAmount: { type: Number }, // the amount we need to charge for the setup fee once trial is over
      setupFeeResolvedAt: { type: Date }, // when setup fee was charged or discarded if subscription was cancelled
      setupFeeResolutionMethod: {
        // how was the setup fee processed
        type: String,
        enum: ['hook', 'user'],
      },
      setupFeeResolvedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // user that manually processed the setup fee
      setupFeeResolutionStatus: {
        // final outcome, if this is set there will be no more automatic attempts to charge the setup fee
        type: String,
        enum: [null, 'pending', 'charged', 'cancelled', `invoiced`],
        default: null,
      },
    },

    cancel_effective_date: { type: Date, default: null },
    cancellation_requested_date: { type: Date, default: null },

    _owner: { type: Schema.Types.ObjectId, ref: 'User' },
    _signer: { type: Schema.Types.ObjectId, ref: 'User' },
    _pointOfContact: { type: Schema.Types.ObjectId, ref: 'User' },

    calls: [callSchema],

    salesCalls: [salesCall],

    insuranceSalesCalls: [insuranceSalesCall],

    states: {
      acknowledgedHRExpectation: { type: Boolean, default: false },
      initial_call_skip_scheduling: { type: Boolean, default: false },
      lead_status: {
        type: String,
        enum: ['active', 'nurture', 'notQualified', 'qualified'],
        default: 'active',
      },
      lead_status_reason: { type: String, default: '' },
      onboarded: { type: Boolean, default: false },

      //todo: this is being depricated for salesCall schema
      overview_call: {
        scheduled: { type: Boolean, default: false },
        time: { type: Date, default: null },
        phone: { type: String, default: '' },
        _event: {
          type: Schema.Types.ObjectId,
          ref: 'CalendarEvent',
          default: null,
        },
        completed: { type: Boolean, default: false },
        noShow: { type: Boolean, default: false },
        canceled: { type: Boolean, default: false },
      },
      self_service: { type: Boolean, default: false },
      payrollReservation: {
        salesforceTaskId: { type: String, default: null },
        outcome: { type: String, default: null },
      },
    },

    settings: {
      approvers: { type: Boolean, default: false },
      override_documents: [overDocumentSchema],
      advisor: { type: Schema.Types.ObjectId, ref: 'User' },
      salesPerson: { type: Schema.Types.ObjectId, ref: 'User' },
      insuranceSalesPerson: { type: Schema.Types.ObjectId, ref: 'User' },
      zendesk_org_id: { type: Number, default: null },

      show_report_card: { type: Boolean, default: true },
      show_report_card_splash: { type: Boolean, default: false },
      reportCardCadence: { type: String, enum: reportCardsCadence, default: null },
      showReportCardFeedback: { type: Boolean, default: false },
      manager_can_grade_employees: { type: Boolean, default: false },

      show_employee_review: { type: Boolean, default: false },
      employee_review: { type: Boolean, default: false },
      employee_review_frequency: { type: String, enum: ['quarterly', 'annual'], default: 'annual' },
      employee_review_month_start: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], default: 1 },
      employee_review_quarter_schedule: [Schema.Types.Mixed],
      employee_review_quarter_start: { type: Date, default: null },
      bci_enabled: { type: Boolean, default: true },
      bci_enabled_ever: { type: Boolean, default: true },
      bci_dismissed: { type: Boolean, default: true },
      insurance_enabled: { type: Boolean, default: true },
      personal_insurance_enabled: { type: Boolean, default: false },
      hidePayRate: { type: Boolean, default: false },

      covid_help: { type: Boolean, default: true },

      salesforceCompanyAccountId: { type: String, default: null },
      salesforceLeadId: { type: String, default: null },
      salesforceOpportunityId: { type: String, default: null },
      salesforceInsuranceOpportunityId: { type: String, default: null },
      salesforceEssentialUpsellOpportunityId: { type: String, default: null },
      salesforceSubscriptionId: { type: String, default: null },

      automateCPDWorkflow: { type: Boolean, default: null },
      bypassChatOnly: { type: Boolean, default: false },
    },

    salesforce: {
      salesOverviewCallEventId: { type: String, default: null },
    },

    approvers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    schedule_call: {
      date: { type: String, default: '' },
      time: { type: String, default: '' },
      called: { type: Boolean, default: false },
      scheduled: { type: Boolean, default: false }, //dennis
      marked_called: { type: Date, default: '' },
      timestamp: { type: Date, default: '' },
      phone: { type: String, default: '' },
    },

    marketing: {
      data: { type: Schema.Types.Mixed, default: null },
      experiment: { type: String, default: '' },
      http_referer: { type: String, default: '' },
      query_params: { type: Schema.Types.Mixed, default: {} },
      growsumo: {
        customerId: { type: String, default: '' },
        partnerKey: { type: String, default: '' },
      },
      howDidYouHear: {
        type: String,
        default: '',
      },
      referredByCode: {
        type: String,
        default: '',
      },
      pageRegisteredOn: { type: String, default: '' },
      testName: { type: String, default: '' },
      coronaAssistanceRequested: { type: Boolean, default: false },
      firstContactChannel: { type: String, default: '' },
      leadFormDetails: {
        ctaName: { type: String, default: '' },
        format: { type: String, default: '' },
      },
    },

    notes: [noteSchema],

    company_overview: {
      type: companyOverviewSchema,
      default: {},
    },

    roadmap_steps: {
      type: [roadmapStepSchema],
      default: default_roadmap_states,
    },

    persona: {
      difficulty: { type: Number, default: null },
      expectations: { type: Number, default: null },
      helpRequired: { type: Number, default: null },
    },

    test: { type: Boolean, default: false },

    converted_at: { type: Date, default: null },
    churned_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    schema_version: { type: String, default: '1.1.0' },

    locked: {
      active: { type: Boolean, default: false },
      plan: { type: String, default: '' },
      setupFee: { type: Number, default: null },
      trialDuration: { type: Number, default: null },
    },
    salesHrAuditScore: { type: Number, default: null },
  },
  {
    usePushEach: true,
    toJSON: {
      virtuals: true,
      transform: _transformSchema,
    },
    toObject: {
      virtuals: true,
      transform: _transformSchema,
    },
  },
);

function _transformSchema(doc, ret) {
  // backward compatibility for legacy stripe object structure
  if (doc.stripe.customerId) {
    ret.stripe.customer = {
      id: doc.stripe.customerId,
      email: doc.stripe.customerEmail,
      delinquent: doc.stripe.delinquent,
    };
    if (doc.stripe.subscriptionId) {
      ret.stripe.subscription = {
        id: doc.stripe.subscriptionId,
        created: doc.stripe.subscribedAt,
        plan: {
          id: doc.plan,
          nickname: doc.plan,
          amount: doc.stripe.planAmount * 100,
          interval: doc.stripe.planInterval,
        },
      };
      if (doc.stripe.currentPeriodStart) {
        ret.stripe.subscription.current_period_start = doc.stripe.currentPeriodStart.valueOf() / 1000;
      }
      if (doc.stripe.currentPeriodEnd) {
        ret.stripe.subscription.current_period_end = doc.stripe.currentPeriodEnd.valueOf() / 1000;
      }
      if (doc.stripe.expected_payment_date) {
        ret.stripe.subscription.current_period_end = doc.stripe.expected_payment_date.valueOf() / 1000;
      }
      ret.stripe.setup_fee_invoice = {
        amount: doc.stripe.setupFeeAmount * 100,
      };
    }
    if (doc.stripe.emergencyFeeAmount) {
      ret.stripe.hrEmergencyFeeInvoice = {
        amount: doc.stripe.emergencyFeeAmount * 100,
      };
    }
  }
  return ret;
}

companySchema.index({ name: 'text' });
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });
companySchema.index({
  test: 1,
  name: 1,
});
companySchema.index({
  'stripe.subscriptionId': 1,
});

companySchema.plugin(mongoosePaginate);

companySchema.pre('save', function () {
  if (!this.unique_url_id) {
    this.setUniqueUrl();
  }
  this.updated_at = new Date();
});

companySchema.virtual('delinquent').get(function () {
  return _.get(this, 'stripe.delinquent', false);
});

companySchema.virtual('paused').get(function () {
  return STRIPE_PAUSED_PLAN_PATTERN.test(this.plan);
});

companySchema.virtual('_events', {
  ref: 'Event',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: '_company',
  match: {
    'deletion.deleted_at': null,
  },
});

companySchema.virtual('_policies', {
  ref: 'Policy',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_terminations', {
  ref: 'Termination',
  localField: '_users',
  foreignField: 'user',
});

companySchema.virtual('_resignations', {
  ref: 'Resignation',
  localField: '_users',
  foreignField: '_employee',
});

companySchema.virtual('_pips', {
  ref: 'Pip',
  localField: '_id',
  foreignField: 'company',
});

companySchema.virtual('_writtenwarnings', {
  ref: 'Writtenwarning',
  localField: '_id',
  foreignField: 'company',
});

companySchema.virtual('_verbalwarnings', {
  ref: 'Verbalwarning',
  localField: '_id',
  foreignField: 'company',
});

companySchema.virtual('_pips', {
  ref: 'Pip',
  localField: '_id',
  foreignField: 'company',
});

companySchema.virtual('_folders', {
  ref: 'Folder',
  localField: '_id',
  foreignField: '_company',
  match: {
    'deletion.deleted_at': null,
  },
});

companySchema.virtual('_feeds', {
  ref: 'Feed',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_reportCards', {
  ref: 'ReportCard',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_cancellations', {
  ref: 'Cancellation',
  localField: '_id',
  foreignField: '_company',
  options: {
    sort: {
      createdDate: -1,
    },
  },
});

companySchema.virtual('_qna', {
  ref: 'Qna',
  localField: '_id',
  foreignField: '_company',
  justOne: true,
  options: {
    sort: {
      created_at: -1,
    },
  },
});

companySchema.virtual('_users', {
  ref: 'User',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_advisors', {
  ref: 'CompanyAdvisor',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('_leadForms', {
  ref: 'LeadForm',
  localField: '_id',
  foreignField: '_company',
});

companySchema.virtual('lastNote').get(function () {
  if (this.notes && this.notes.length) {
    return this.notes[this.notes.length - 1];
  } else {
    return null;
  }
});

companySchema.methods.getSalesCallByKind = function (kind) {
  return this.salesCalls.find((c) => c.kind == kind);
};

companySchema.methods.getMostRecentOverviewCall = function () {
  return getMostRecentOverviewCall(this.salesCalls);
};

companySchema.methods.getMostRecentInsuranceCallByKind = function (kind) {
  return getMostRecentCallByKind(this.insuranceSalesCalls, kind);
};

companySchema.methods.getFirstOverviewCall = function () {
  const ovCalls = this.salesCalls.filter((c) => c.kind == 'overview-call');
  return _.minBy(ovCalls, 'created_at');
};

companySchema.methods.setUniqueUrl = function () {
  const company_name_short = this.name
    .substring(0, 4)
    .replace(/[^a-z0-9+]+/gi, '')
    .trim();

  const unique_url = company_name_short.toLowerCase() + '-' + uidgen.generateSync();

  this.unique_url_id = unique_url;
};

companySchema.methods.resetRoadMapStates = function () {
  this.roadmap_steps = default_roadmap_states();

  return this;
};

companySchema.methods.eventData = function () {
  return {
    _id: this._id,
    name: this.name,
    profile: this.profile.toObject(),
    settings: this.settings.toObject(),
  };
};

companySchema.methods.approversData = async function () {
  await this.populate({
    path: 'approvers',
    populate: {
      path: '_user _company',
    },
  }).execPopulate();

  const approvers = this.approvers.map((user) => {
    return {
      _id: user._id,
      email: user._auth.email,
      profile: user.profile.toObject(),
    };
  });

  return approvers;
};

companySchema.methods.getOverview = async function () {
  //get initial call data
  this.company_overview.initial_call.schedule = this.schedule_call;
  if (this.schedule_call.called) {
    this.company_overview.initial_call.hidden = true;
    this.company_overview.policy_documents.policies.map((policy) => {
      policy.states.consultation.active = false;
      policy.states.consultation.complete = true;
      policy.states.draft.active = true;
    });
  }
  if (this.schedule_call.date != '' || this.schedule_call.time != '')
    this.company_overview.initial_call.scheduled = true;

  //update policy docs status
  if (this.company_overview.policy_documents.policies.length == 0)
    ['handbook', 'employee_agreement', 'harassment_policy', 'hipaa_notice', 'employee_notice'].map((value) =>
      this.company_overview.policy_documents.policies.push({
        name: value,
        hidden: ['employee_agreement', 'employee_notice'].includes(value) ? true : false,
        states: {
          consultation: {
            active: true,
            complete: false,
          },
          draft: {
            active: false,
            complete: false,
          },
          document_ready: {
            active: false,
            complete: false,
            file: null,
          },
        },
      }),
    );
  else {
    if (this.company_overview.policy_documents.policies.every((policy) => policy.states.document_ready.complete))
      this.company_overview.policy_documents.complete = true;
    this.company_overview.policy_documents.policies.map((policy) => {
      if (policy.states.document_ready.file) {
        policy.states.consultation.active = false;
        policy.states.consultation.complete = true;
        policy.states.draft.active = false;
        policy.states.draft.complete = true;
        policy.states.document_ready.active = false;
        policy.states.document_ready.complete = true;
      }
    });
  }
};

companySchema.methods.getRoadmapStep = function (step_name) {
  return this.roadmap_steps.find((s) => s.name == step_name);
};

companySchema.methods.updateRoadmapStep = function (new_step) {
  const step = this.getRoadmapStep(new_step.name);

  Object.assign(step, new_step);

  this.markModified('roadmap_steps');

  return this;
};

companySchema.methods.markPaying = function () {
  this.status = 'paying';
  this.states.lead_status = 'qualified';
  if (!this.converted_at) this.converted_at = Date.now();
  return this;
};

companySchema.methods.verifyAndMarkSelfService = function () {
  if (!this.salesCalls || this.salesCalls.length === 0) {
    this.states.self_service = true;

    return true;
  }

  return false;
};

companySchema.methods.setPlan = function (plan) {
  this.plan = plan;
};

companySchema.methods.setCoupon = function (couponId) {
  this.stripe.couponId = couponId;
};

companySchema.methods.setStripeCustomer = function (customer) {
  this.stripe.customerId = customer.id;
  this.stripe.customerEmail = customer.email;
  this.stripe.delinquent = customer.delinquent;
};

companySchema.methods.setStripeSubscription = function (subscription) {
  const toDate = (v) => (v == null ? null : new Date(v * 1000));

  this.stripe.subscriptionId = subscription.id;
  this.stripe.subscribedAt = toDate(subscription.created);
  this.stripe.planAmount = subscription.plan.amount / 100;
  this.stripe.planInterval = subscription.plan.interval;
  // update plan inside company if required
  const planId = subscription.plan.id;
  if (planId && this.plan !== planId) {
    this.plan = planId;
  }

  // update period details
  this.stripe.currentPeriodStart = toDate(subscription.current_period_start);
  this.stripe.currentPeriodEnd = toDate(subscription.current_period_end);

  switch (subscription.status) {
    case 'trialing':
      this.stripe.expected_payment_date = toDate(subscription.trial_end);
      this.trial.trialStartDate = toDate(subscription.trial_start);
      this.trial.trialEndingDate = toDate(subscription.trial_end);
      this.trial.originalStripeSubscriptionId = subscription.id;
      this.status = 'trial';
      break;

    case 'active':
    case 'past_due':
      this.stripe.expected_payment_date = toDate(subscription.current_period_end);
      break;

    case 'incomplete':
    case 'incomplete_expired':
    case 'canceled':
    case 'unpaid':
      this.stripe.expected_payment_date = null;
      break;
  }
};

companySchema.methods.clearStripeSubscription = function () {
  delete this.stripe.subscriptionId;
  delete this.stripe.subscribedAt;
  delete this.stripe.planId;
  delete this.stripe.planAmount;
  delete this.stripe.planInterval;
  delete this.stripe.currentPeriodStart;
  delete this.stripe.currentPeriodEnd;
  delete this.stripe.original_payment_date;
  delete this.stripe.expected_payment_date;
  delete this.stripe.attempt_count;
};

companySchema.methods.setStripeDefaultCard = function (stripeSource) {
  this.stripe.defaultCard.stripeId = stripeSource.id;
  this.stripe.defaultCard.last4 = stripeSource.last4;
  this.stripe.defaultCard.expireMonth = stripeSource.exp_month;
  this.stripe.defaultCard.expireYear = stripeSource.exp_year;
  this.stripe.defaultCard.brand = stripeSource.brand;
};

companySchema.methods.setSetupFeeInvoice = function (invoice) {
  this.stripe.setupFeeAmount = invoice.amount / 100;
};

companySchema.methods.setHrEmergencyFeeInvoice = function (invoice) {
  this.stripe.emergencyFeeAmount = invoice.amount / 100;
};

companySchema.methods.setSalesforceCompanyAccountId = function (accountId) {
  this.settings.salesforceCompanyAccountId = accountId;
};

companySchema.methods.setSalesforceLeadId = function (leadId) {
  this.settings.salesforceLeadId = leadId;
};

companySchema.methods.setSalesforceSubscriptionId = function (subscriptionId) {
  this.settings.salesforceSubscriptionId = subscriptionId;
};

companySchema.methods.setSalesforceOpportunityId = function (opportunityId) {
  this.settings.salesforceOpportunityId = opportunityId;
};

companySchema.methods.setFromQNAAnswers = function (type, answers) {
  switch (type) {
    case 'CompanyOverview':
      this.setFromCompanyOverviewAnswers(answers);
      break;

    case 'InsuranceOverview':
      this.setFromInsuranceOverviewAnswers(answers);
      break;

    case 'Audit':
      this.setFromAuditAnswers(answers);
      break;
    case 'SalesHrAudit':
      this.setFromSalesHrAuditAnswers(answers);
      break;
  }
};

/**
 * Updates company data from Insurance Overview questionnaire
 * Note: intended to be called AFTER questionnaire completion
 *
 * @param answers
 */
companySchema.methods.setFromInsuranceOverviewAnswers = function (answers) {
  const { selfReportedLinesOfInsurance } = answers;

  const insuranceLines = selfReportedLinesOfInsurance ? Object.keys(selfReportedLinesOfInsurance) : [];

  const convertYesNo = (val) => val === `Yes`;
  const convertAnswerUnknown = (val = {}) => (val.unknown ? `I don't know` : val.brokerage || val.agent);

  for (const key of insuranceLines) {
    switch (key) {
      case 'Workers Compensation':
        this.self_reported_insurance.workers = selfReportedLinesOfInsurance[key].has;
        this.self_reported_insurance_carrier.workers = selfReportedLinesOfInsurance[key].carrier;
        break;
      case 'Professional Liability':
        this.self_reported_insurance.pro_liab = selfReportedLinesOfInsurance[key].has;
        this.self_reported_insurance_carrier.pro_liab = selfReportedLinesOfInsurance[key].carrier;
        break;
      case 'Employment Practices Liability':
        this.self_reported_insurance.epli = selfReportedLinesOfInsurance[key].has;
        this.self_reported_insurance_carrier.epli = selfReportedLinesOfInsurance[key].carrier;
        break;
      case 'Cyber Liability':
        this.self_reported_insurance.cyber = selfReportedLinesOfInsurance[key].has;
        this.self_reported_insurance_carrier.cyber = selfReportedLinesOfInsurance[key].carrier;
        break;
      case 'General Liability':
        this.self_reported_insurance.general = selfReportedLinesOfInsurance[key].has;
        this.self_reported_insurance_carrier.general = selfReportedLinesOfInsurance[key].carrier;
        break;
      case 'Policies':
        for (const policy of selfReportedLinesOfInsurance[key]) {
          this.self_reported_policies.addToSet({
            name: policy.name,
            carrier: policy.carrier,
          });
        }
        break;
    }
  }

  this.self_reported_insurance_brokerage =
    answers.reportedInsuranceBrokerage && convertAnswerUnknown(answers.reportedInsuranceBrokerage);
  this.self_reported_insurance_agent = answers.insuranceAgentInput && convertAnswerUnknown(answers.insuranceAgentInput);
  this.self_reported_filed_bankruptcy =
    answers.selfReportedFiledBankruptcy && convertYesNo(answers.selfReportedFiledBankruptcy);
  this.self_reported_open_investigations =
    answers.selfReportedOpenInvestigations && convertYesNo(answers.selfReportedOpenInvestigations);
  this.self_reported_owned_vehicles =
    answers.selfReportedHasBusinessOwnedVehicles && convertYesNo(answers.selfReportedHasBusinessOwnedVehicles);
  this.self_reported_owned_office_space =
    answers.selfReportedOwnsOfficeSpace && convertYesNo(answers.selfReportedOwnsOfficeSpace);
};

/**
 * Updates company data from Company Overview questionnaire
 *
 * Note: intended to be called AFTER questionnaire completion
 *
 * @param answers
 */
companySchema.methods.setFromCompanyOverviewAnswers = function (answers) {
  const employeeBreakdown = _.get(answers, 'employeeBreakdown') || {};
  const companyAddress = _.get(answers, 'companyAddress', {}) || {};
  const { city, state, zip, address } = companyAddress;

  const estimated_monthly_payroll = answers.estimatedMonthlyPayroll
    ? answers.estimatedMonthlyPayroll.replace(/\D/g, '') / 12
    : null;
  const estimated_annual_revenue = answers.estimatedAnnualRevenue
    ? answers.estimatedAnnualRevenue.replace(/\D/g, '')
    : null;
  const industry = Array.isArray(answers.industry) ? answers.industry[0] : answers.industry;

  this.name = answers.legalName || this.name;
  this.profile.address = address;
  this.profile.city = city;
  this.profile.state = state;
  this.profile.zip = zip;
  this.profile.estimated_monthly_payroll = estimated_monthly_payroll;
  this.profile.dba = answers.dba;
  this.profile.industry = industry;
  this.profile.num_of_part_time_employees = employeeBreakdown.numOfPartTimeEmployees;
  this.profile.num_of_full_time_salary_employees = employeeBreakdown.numOfFullTimeSalaryEmployees;
  this.profile.num_of_full_time_hourly_employees = employeeBreakdown.numOfFullTimeHourlyEmployees;
  this.profile.num_of_contractors = employeeBreakdown.numOfContractors;
  this.profile.estimated_annual_revenue = estimated_annual_revenue;
  this.profile.customer_provided_handbook = answers.hasHandbook === 'Yes';
  this.profile.reported_owner_name = answers.reportedOwnerName;
  this.profile.incorporated_in = answers.stateIncorporated;
  this.profile.established_in = answers.companyEstablished;
  this.profile.is_federal_contractor = answers.isFederalContractor === 'Yes';
  this.profile.fein = answers.fein;
  this.profile.corporation_type = answers.businessType;
  this.profile.has_commissioned_workers = answers.hasCommissionWorkers === 'Yes';
  this.profile.pay_frequency = answers.payFrequency;
  this.profile.payday = answers.payDow;
  this.profile.payday_schedule = answers.payDom;
};

companySchema.methods.setFromAuditAnswers = function (answers) {
  const convertYesNoNotSure = (val) => (val === `I'm not sure` || val == null ? null : val === 'Yes');

  const employeeBreakdown = _.get(answers, 'employeeBreakdown') || {};
  const estimated_monthly_payroll = answers.total_payroll ? answers.total_payroll / 12 : null;
  const industry = Array.isArray(answers.industry) ? answers.industry[0] : answers.industry;

  this.name = answers.legal_name || this.name;
  this.profile = {
    ...this.profile,
    zip: answers.zip,
    is_federal_contractor: convertYesNoNotSure(answers.federal_contractor),
    industry,
    num_of_part_time_employees: answers.pt_employees || employeeBreakdown.numOfPartTimeEmployees,
    num_of_full_time_salary_employees: answers.slry_employees || employeeBreakdown.numOfFullTimeSalaryEmployees,
    num_of_full_time_hourly_employees: answers.hrly_employees || employeeBreakdown.numOfFullTimeHourlyEmployees,
    num_of_contractors: answers.independent_contractor_count || employeeBreakdown.numOfContractors,
    estimated_annual_revenue: answers.revenue,
    customer_provided_handbook: convertYesNoNotSure(answers.have_handbook),
    estimated_monthly_payroll,
  };

  this.self_reported_insurance = this.self_reported_insurance || {};
  this.self_reported_insurance = {
    ...this.self_reported_insurance,
    general: convertYesNoNotSure(answers.have_gen_liab_insurance),
    epli: convertYesNoNotSure(answers.have_epli),
    pro_liab: convertYesNoNotSure(answers.have_pro_liab_insurance),
    cyber: convertYesNoNotSure(answers.have_cyber_liab_insurance),
    workers: convertYesNoNotSure(answers.have_wc_insurance),
  };

  this._pointOfContact = answers.point_of_contact;
};

companySchema.methods.setFromSalesHrAuditAnswers = function (answers) {
  const convertYesNo = (val) => val === `Yes`;
  this.profile = {
    ...this.profile,
    customer_provided_handbook: convertYesNo(answers.hasHandbook),
  };

  this.self_reported_insurance = {
    ...this.self_reported_insurance,
    workers: convertYesNo(answers.hasWorkersCompensation),
  };

  const hrAuditScoreMap = {
    hasSexualHarassmentPolicy: 5,
    hasHandbook: 5,
    hasPolicies: 5,
    hasI9sForAllEmployees: 20,
    hasLaborPosters: 15,
    providesOfferLetters: 5,
    hasEmployeeFiles: 5,
    hasWorkersCompensation: 5,
    hasJobDescriptions: 10,
    hasTerminatedEmployee: 0,
    documentsVerbalAndWrittenWarnings: 10,
    providesTerminationRequirements: 10,
    providesAnnualReviewsForEmployees: 5,
  };

  const salesHrAuditScore = Object.keys(answers).reduce((accumulator, answerKey) => {
    if (answers[answerKey] === 'Yes') accumulator += hrAuditScoreMap[answerKey];

    return accumulator;
  }, 0);

  this.salesHrAuditScore = salesHrAuditScore;
};

module.exports = companySchema;
