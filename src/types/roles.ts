export enum CompanyUserRole {
  OWNER = 'company:owner',
  ADMIN = 'company:admin',
  MANAGER = 'company:manager',
  EMPLOYEE = 'company:employee',
}

export enum HoneyUserRole {
  HONEY_ADMIN = 'honey:hr-admin',
  SALES = 'honey:sales',
  PARTNER = 'honey:partner',
  SALES_DEVELOPMENT_REPRESENTATIVE = 'honey:sdr',
  INSURANCE = 'honey:insurance',
  CUSTOMER_SUCCESS_REPRESENTATIVE = 'honey:csr',
  ONBOARDING_SPECIALIST = 'honey:obs',
  HR_MANAGER = 'honey:hrm',
  HANDBOOK_SPECIALIST = 'honey:hbs',
}

export enum HoneyUserAccessRole {
  SELF_COMPANY = 'access:self-company', // you can perform HoneyUserRole for the company you belong to
  ASSIGNED = 'access:assigned', // you can perform HoneyUserRole for the companies you are assigned to
  OTHER = 'access:other', // you can perform HoneyUserRole for all other companies
}
