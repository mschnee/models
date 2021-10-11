import { pre, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CompanyInsuranceLineType } from '../../../types/insurance/CompanyInsuranceLineType';
import { CompanyInsurancePlanBambeeStatus } from '../../../types/insurance/CompanyInsurancePlanBambeeStatus';
import { CompanyInsurancePlanStatus } from '../../../types/insurance/CompanyInsurancePlanStatus';
import { CompanyInsurancePlanType } from '../../../types/insurance/CompanyInsurancePlanType';
import {InsuranceCarrier} from './InsuranceCarrier.schema';

export function lineTypeName(t: CompanyInsuranceLineType): string {
  switch (t) {
    case CompanyInsuranceLineType.EmploymentPracticesLiability:
      return 'Employment Practices Liability';
    case CompanyInsuranceLineType.GeneralLiability:
      return 'General Liability';
    case CompanyInsuranceLineType.WorkersComp:
      return 'Workers Comp';
    case CompanyInsuranceLineType.Cyber:
      return 'Cyber';
    case CompanyInsuranceLineType.ProfessionalLiability:
      return 'Professional Liability';
    case CompanyInsuranceLineType.PollutionLiability:
      return 'Pollution Liability';
    case CompanyInsuranceLineType.EnvironmentalLiability:
      return 'Environmental Liability';
    case CompanyInsuranceLineType.ProductLiability:
      return 'Product Liability';
    case CompanyInsuranceLineType.BusinessOwners:
      return 'Business Owners';
    case CompanyInsuranceLineType.CommercialProperty:
      return 'Commercial Property';
    case CompanyInsuranceLineType.CommercialAuto:
      return 'Commercial Auto';
    case CompanyInsuranceLineType.DirectorsAndOfficers:
      return 'Directors & Officers';
    case CompanyInsuranceLineType.LiquorLiability:
      return 'Liquor Liability';
    case CompanyInsuranceLineType.SpecialEvents:
      return 'Special Events';
    case CompanyInsuranceLineType.InlandMarine:
      return 'Inland Marine';
    case CompanyInsuranceLineType.OceanMarine:
      return 'Ocean Marine';
    case CompanyInsuranceLineType.StockThroughPut:
      return 'Stock Through Put';
    case CompanyInsuranceLineType.MedicalMalpractice:
      return 'Medical Malpractice';
    case CompanyInsuranceLineType.EquipmentBreakdown:
      return 'Equipment Breakdown';
    case CompanyInsuranceLineType.BusinessInterruption:
      return 'Business Interruption';
    case CompanyInsuranceLineType.GarageLiability:
      return 'Garage Liability';
    case CompanyInsuranceLineType.DealersOpenLot:
      return 'Dealers Open Lot';
    case CompanyInsuranceLineType.HiredAndNonOwnedAuto:
      return 'Hired and Non Owned Auto';
    case CompanyInsuranceLineType.FiduciaryBond:
      return 'Fiduciary Bond';
    case CompanyInsuranceLineType.FidelityBond:
      return 'Fidelity Bond';
    case CompanyInsuranceLineType.SuretyBond:
      return 'Surety Bond';
    case CompanyInsuranceLineType.ExcessProperty:
      return 'Excess Property';
    case CompanyInsuranceLineType.ExcessCasualty:
      return 'Excess Casualty';
    case CompanyInsuranceLineType.Umbrella:
      return 'Umbrella';
    case CompanyInsuranceLineType.DifferenceInConditions:
      return 'Difference In Conditions';
    case CompanyInsuranceLineType.PersonalLines:
      return 'Personal Lines';
    case CompanyInsuranceLineType.ProgramAdministrator:
      return 'Program Administrator';
  }
}

export function lineTypeFromInterest(companyInterestName: string): CompanyInsuranceLineType {
  switch (companyInterestName) {
    case 'general':
      return CompanyInsuranceLineType.GeneralLiability;
    case 'epli':
      return CompanyInsuranceLineType.EmploymentPracticesLiability;
    case 'pro_liab':
      return CompanyInsuranceLineType.ProfessionalLiability;
    case 'cyber':
      return CompanyInsuranceLineType.Cyber;
    case 'workers':
      return CompanyInsuranceLineType.WorkersComp;
    default:
      return null;
  }
}

class CompanyInsurancePlanAgentAddress {
  @prop()
  address1: string;

  @prop()
  address2?: string;

  @prop()
  address3?: string;

  @prop()
  city: string;

  @prop()
  state: string;

  @prop()
  zip: string;
}

class CompanyInsurancePlanAgent {
  @prop()
  name: string;

  @prop({ default: () => new CompanyInsurancePlanAgentAddress() })
  address: CompanyInsurancePlanAgentAddress;

  @prop()
  phoneNumber: string;

  @prop()
  email: string;
}

export class CompanyInsurancePlanLimit {
  @prop()
  key: string;

  @prop()
  value: string;
}

export class CompanyInsurancePlanBorLetter {
  @prop()
  pandaDocumentId: string;

  @prop()
  pandaDocumentStatus: string;

  @prop()
  pandaPreviewSessionId?: string;

  @prop()
  pandaPreviewExpiresAt?: Date;

  @prop()
  signedAt?: Date;

  @prop()
  signedFrom?: string;

  @prop({ ref: 'User' })
  _signedBy: Ref<any>;
}

class CompanyInsurancePlanStatusUpdate {
  @prop({ ref: 'User' })
  _updatedBy: Ref<any>;

  @prop({ default: () => new Date() })
  updatedAt: Date;

  @prop({ enum: Object.values(CompanyInsurancePlanStatus) })
  updatedStatusTo: CompanyInsurancePlanStatus;
}

@pre<CompanyInsurancePlan>('save', function (next) {
  this.updatedAt = new Date();

  if (this.isNew) {
    this.statusHistory.push({
      _updatedBy: this._createdBy,
      updatedStatusTo: this.status,
    });
  } else if (this.isModified('status')) {
    this.statusDate = new Date();
    this.statusHistory.push({
      _updatedBy: this._updatedBy,
      updatedStatusTo: this.status,
    });
  }

  return next();
})
export class CompanyInsurancePlan {
  @prop({ ref: 'Company', required: true })
  _company: Ref<any>;

  @prop({ ref: 'InsuranceCarrier', default: null })
  _carrier?: Ref<InsuranceCarrier>;

  @prop()
  unassociatedCarrierName?: string;

  @prop({ ref: 'CompanyInsurancePlan' })
  _parentPlans?: Types.Array<Ref<CompanyInsurancePlan>>;

  @prop({ enum: Object.values(CompanyInsurancePlanStatus), default: CompanyInsurancePlanStatus.Current })
  status?: CompanyInsurancePlanStatus;

  @prop({ default: () => new Date(), index: true })
  statusDate?: Date;

  @prop({ type: CompanyInsurancePlanStatusUpdate })
  statusHistory?: Types.Array<CompanyInsurancePlanStatusUpdate>;

  @prop({ enum: Object.values(CompanyInsurancePlanBambeeStatus), default: CompanyInsurancePlanBambeeStatus.None })
  bambeePlanStatus?: CompanyInsurancePlanBambeeStatus;

  @prop()
  policyNumber?: string;

  @prop({ default: () => new CompanyInsurancePlanAgent() })
  agent?: CompanyInsurancePlanAgent;

  @prop({ enum: Object.values(CompanyInsuranceLineType), index: true })
  lineType: CompanyInsuranceLineType;

  @prop({ enum: Object.values(CompanyInsurancePlanType), index: true })
  planType: CompanyInsurancePlanType;

  @prop({ index: true })
  effectiveDate?: Date;

  @prop({ index: true })
  expirationDate?: Date;

  @prop()
  claimsPhoneNumber?: string;

  @prop({ default: null })
  isClaimsmadePolicy?: boolean;

  @prop()
  premium?: number;

  @prop()
  deductible?: number;

  @prop({ type: CompanyInsurancePlanLimit, _id: false })
  limits?: Types.Array<CompanyInsurancePlanLimit>;

  @prop({ ref: 'File' })
  documents?: Types.Array<Ref<any>>;

  @prop({ _id: false, default: null })
  borLetter?: CompanyInsurancePlanBorLetter;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop({ ref: 'User' })
  _createdBy: Ref<any>;

  @prop()
  updatedAt?: Date;

  @prop({ ref: 'User' })
  _updatedBy?: Ref<any>;

  get lineTypeName(): string {
    return lineTypeName(this.lineType);
  }
}
