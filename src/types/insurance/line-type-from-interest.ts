import { CompanyInsuranceLineType } from './CompanyInsuranceLineType';

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
