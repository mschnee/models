import { CompanyInsuranceLineType } from './CompanyInsuranceLineType';

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
