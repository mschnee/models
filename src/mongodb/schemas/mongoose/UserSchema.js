const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = require('./UserProfileSchema');

const userSchema = new Schema(
  {
    _auth: { type: Schema.Types.ObjectId, ref: 'Auth', index: true },
    _company: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    _manager: { type: Schema.Types.ObjectId, ref: 'User', index: true },

    directReportCount: { type: Number, default: 0 },

    role: {
      type: String,
      enum: [
        'admin',
        'user',
        'employee',
        'hr-admin',
        'sales',
        'partner',
        'sdr',
        'insurance',
        'csr',
        'obs',
        'hrm',
        'hbs',
        'default',
      ],
      default: 'user',
    },

    profile: { type: profileSchema, default: {} },

    permissions: {
      manager: { type: Boolean, default: false },
      approver: { type: Boolean, default: false },
      canCancelAccount: { type: Boolean, default: false },
      canRetractSignedPolicies: { type: Boolean, default: false },
      canEditGlobalPolicies: { type: Boolean, default: false },
      canViePayrollTab: { type: Boolean, default: false },
    },

    states: {
      email_notification: { type: Boolean, default: true },
      onboard_request: { type: Boolean, default: false },
      onboarded: { type: Boolean, default: false },
      termination_request: { type: Boolean, default: false },
      terminated: { type: Boolean, default: false },
      self_signup: {
        registered: { type: Boolean, default: false },
        activated: { type: Boolean, default: false },
      },
      _resignation: {
        last_date: { type: Date, default: '' },
        status: { type: String, default: '' },
      },

      viewedOnboardingInstructions: {
        type: String,
        enum: ['', 'firstTime', 'lastTime'],
        default: '',
      },

      viewedInsuranceIntroduction: {
        type: Boolean,
        default: false,
      },
      viewedInsurance: {
        type: Boolean,
        default: false,
      },
      interestedInPersonalInsurance: {
        type: Boolean,
        default: false,
      },
      viewedPersonalInsurance: {
        type: Boolean,
        default: false,
      },
      viewedCovid: {
        type: Boolean,
        default: false,
      },
      viewedTaskCenter: {
        type: Boolean,
        default: false,
      },
      viewedVideoTourBusinessHealth: {
        type: Boolean,
        default: false,
      },
      viewedVideoTourCabinet: {
        type: Boolean,
        default: false,
      },
      viewedVideoTourPolicy: {
        type: Boolean,
        default: false,
      },
      viewedVideoTourReportCards: {
        type: Boolean,
        default: false,
      },
      viewedVideoTourStaffFolder: {
        type: Boolean,
        default: false,
      },
    },

    settings: {
      calendar_channel: {
        type: Schema.Types.ObjectId,
        ref: 'GoogleWatchChannel',
      },
      zendesk_org_membership_id: { type: Number, default: null },
      zendesk_user_id: { type: Number, default: null },
      zendesk_email: { type: String, default: null },
      intercomUserId: { type: Number, default: null },
      intercomEmail: { type: String, default: '' },
      hrEmailAlias: { type: String, default: '' },
      slackUserId: { type: String, default: '' },
      salesforceUserId: { type: String, default: '' },
      salesforceContactId: { type: String, default: null },
      vonageExtension: { type: String, default: '' },
      vonageNumber: { type: String, default: '' },
      calendlySlug: { type: String, default: '' },
      pandaContactId: { type: String, default: null },
    },

    //marking deleted users
    active: { type: Boolean, default: true, required: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    minimize: false,
  },
);

userSchema.index({
  role: 1,
});

userSchema.index({
  _company: 1,
  role: 1,
  active: 1,
  'permissions.manager': 1,
});

userSchema.index({
  _user: 1,
  active: 1,
});

userSchema.pre('save', async function () {
  if (this.profile) {
    if (this.profile.pay_rate && this.profile.pay_rate.includes('$')) {
      this.profile.pay_rate = this.profile.pay_rate.substring(1);
      this.markModified('profile');
    }
  }

  if (this.isModified('active') && !this.active) {
    // If user turns inactive (user.active is false), then remove his/her documents from policy
    await this.populate('_company').execPopulate();
    if (this._company) {
      await this._company
        .populate({
          path: '_policies',
          model: 'Policy',
          populate: {
            path: '_documents',
            model: 'Document',
          },
        })
        .execPopulate();

      const policiesInProgress = this._company._policies.filter((p) => p.status === 'in-progress');
      const saveArr = policiesInProgress.map((p) => {
        p._documents = p._documents.filter((d) => !(d._employee.equals(this._id) && !d.signed));
        p.signed();
        return p.save();
      });

      await Promise.all(saveArr);
    }
  }
});

userSchema.methods.eventData = async function () {
  await this.populate('_auth').execPopulate();

  return {
    _id: this._id.toString(),
    email: this._auth.email,
    role: this.role,
    profile: this.profile.toObject(),
    activation_status: this._auth.activation_status,
  };
};

userSchema.methods.managerData = async function () {
  await this.populate('manager').execPopulate();

  return {
    email: this.manager.email,
    profile: this.manager.profile.toObject(),
  };
};

userSchema.virtual('_resignation', {
  ref: 'Resignation',
  localField: '_id',
  foreignField: '_employee',
  justOne: true,
  match: {
    reinstated_at: null,
  },
  options: {
    sort: {
      created_at: -1,
    },
  },
});

userSchema.virtual('_termination', {
  ref: 'Termination',
  localField: '_id',
  foreignField: 'employee',
  justOne: true,
  options: {
    sort: {
      created_at: -1,
    },
  },
});

userSchema.virtual('_documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: '_employee',
  match: {
    'deletion.deleted_at': null,
  },
});

userSchema.virtual('_team_members', {
  ref: 'User',
  localField: '_id',
  foreignField: '_manager',
});

userSchema.virtual('overtimePay').get(function () {
  /* If User does not have an hourly pay rate (is salaried), default overtimePay to 0 for HR policy creating purposes */
  if (!this.profile) return;
  if (this.profile.type === 'salary') return 0;
  if (!this.profile.pay_rate) return 'No Employee Pay Rate';

  const sanitized = this.profile.pay_rate.replace(/[^$0-9.]/, '');
  return (parseFloat(sanitized) * 1.5).toFixed(2);
});

module.exports = userSchema;
