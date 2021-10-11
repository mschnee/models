import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Company', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Company can be instantiated', async () => {
    expect(() => {
      new manager.Company();
    }).not.to.throw;
  });

  it('Company phone number gets reformatted', async () => {
    const company1Data = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };

    const company1 = new manager.Company(company1Data);

    expect('+13232134567').to.equal(company1.profile.phone);

    const company2Data = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 323 213 - 4567',
      },
    };

    const company2 = new manager.Company(company2Data);

    expect('+13232134567').to.equal(company2.profile.phone);

    const company3Data = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 323 213 4567',
      },
    };

    const company3 = new manager.Company(company3Data);

    expect('+13232134567').to.equal(company3.profile.phone);
  });

  it('Maps Qna data for Company Overview', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };
    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    const answers = {
      legalName: 'test name',
      dba: 'dba',
      zip: '91342',
      reportedOwnerName: 'Some Owner',
      companyEstablished: '2020',
      companyAddress: {
        zip: '91342',
        state: 'ca',
        city: 'glendale',
        address: '1234 address',
      },
      incorporatedSameStateAsMailing: 'No',
      stateIncorporated: 'CA',
      industry: 'industry',
      isFederalContractor: 'Yes',
      fein: '12345555',
      businessType: 'llc',
      hasCommissionWorkers: 'Yes',
      employeeBreakdown: {
        numOfPartTimeEmployees: '10',
        numOfFullTimeSalaryEmployees: '8',
        numOfFullTimeHourlyEmployees: '6',
        numOfContractors: '4',
      },
      estimatedAnnualRevenue: '2134',
      customerProvidedHandbook: {
        url: 'asdfasdfasdf.com',
      },
      hasHandbook: 'Yes',
      estimatedMonthlyPayroll: '1234',
      payFrequency: 'weekly',
      payDow: 'Monday',
      payDom: [15, -1],
    };
    company.setFromCompanyOverviewAnswers(answers, { industries: [] });

    // Still the same
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    // Overwritten
    expect(company.name).to.equal(answers.legalName);
    expect(company.profile.dba).to.equal(answers.dba);
    expect(company.profile.reported_owner_name).to.equal(answers.reportedOwnerName);
    expect(company.profile.established_in).to.equal(answers.companyEstablished);
    expect(company.profile.incorporated_in).to.equal(answers.stateIncorporated);
    expect(company.profile.is_federal_contractor).to.equal(answers.isFederalContractor === 'Yes');
    expect(company.profile.address).to.equal(answers.companyAddress.address);
    expect(company.profile.city).to.equal(answers.companyAddress.city);
    expect(company.profile.state).to.equal(answers.companyAddress.state);
    expect(company.profile.zip).to.equal(answers.companyAddress.zip);
    expect(company.profile.industry).to.equal(answers.industry);
    expect(company.profile.fein).to.equal(answers.fein);
    expect(company.profile.corporation_type).to.equal(answers.businessType);
    expect(company.profile.has_commissioned_workers).to.equal(answers.hasCommissionWorkers === 'Yes');
    expect(company.profile.num_of_part_time_employees).to.equal(+answers.employeeBreakdown.numOfPartTimeEmployees);
    expect(company.profile.num_of_full_time_salary_employees).to.equal(
      +answers.employeeBreakdown.numOfFullTimeSalaryEmployees,
    );
    expect(company.profile.num_of_full_time_hourly_employees).to.equal(
      +answers.employeeBreakdown.numOfFullTimeHourlyEmployees,
    );
    expect(company.profile.num_of_contractors).to.equal(+answers.employeeBreakdown.numOfContractors);
    expect(company.profile.estimated_annual_revenue).to.equal(+answers.estimatedAnnualRevenue);
    expect(company.profile.customer_provided_handbook).to.be.true;
    expect(company.profile.estimated_monthly_payroll).to.equal(Number(answers.estimatedMonthlyPayroll) / 12);
    expect(company.profile.pay_frequency).to.equal(answers.payFrequency);
    expect(company.profile.payday).to.equal(answers.payDow);
    expect(Array.from(company.profile.payday_schedule.toObject())).to.deep.equal(answers.payDom);
  });

  it('Maps Qna data for Insurance Overview', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };
    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    const answers = {
      selfReportedLinesOfInsurance: {
        'Workers Compensation': {
          has: true,
          carrier: '111',
        },
        'Professional Liability': {
          has: true,
          carrier: '222',
        },
        'Employment Practices Liability': {
          has: true,
          carrier: '333',
        },
        'Cyber Liability': {
          has: true,
          carrier: '444',
        },
        'General Liability': {
          has: true,
          carrier: '555',
        },
        Policies: [
          {
            name: 'Allstate Policy',
            carrier: '9999999999999999',
          },
        ],
      },
      reportedInsuranceBrokerage: {
        brokerage: 'dsaf',
        unknown: false,
      },
      insuranceAgentInput: {
        agent: 'john snow',
        unknown: false,
      },
      selfReportedFiledBankruptcy: 'Yes',
      selfReportedOpenInvestigations: 'Yes',
      selfReportedHasBusinessOwnedVehicles: 'Yes',
      selfReportedOwnsOfficeSpace: 'Yes',
    };
    company.setFromInsuranceOverviewAnswers(answers);

    // Still the same
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    expect(company.self_reported_insurance.workers).to.be.true;
    expect(company.self_reported_insurance_carrier.workers).to.equal('111');

    expect(company.self_reported_insurance.pro_liab).to.be.true;
    expect(company.self_reported_insurance_carrier.pro_liab).to.equal('222');

    expect(company.self_reported_insurance.epli).to.be.true;
    expect(company.self_reported_insurance_carrier.epli).to.equal('333');

    expect(company.self_reported_insurance.cyber).to.be.true;
    expect(company.self_reported_insurance_carrier.cyber).to.equal('444');

    expect(company.self_reported_insurance.general).to.be.true;
    expect(company.self_reported_insurance_carrier.general).to.equal('555');

    expect(company.self_reported_insurance_brokerage).to.equal('dsaf');
    expect(company.self_reported_insurance_agent).to.equal('john snow');

    expect(company.self_reported_filed_bankruptcy).to.be.true;
    expect(company.self_reported_open_investigations).to.be.true;
    expect(company.self_reported_owned_vehicles).to.be.true;
    expect(company.self_reported_owned_office_space).to.be.true;
  });

  it('Maps Qna data for Audit', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };
    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    const answers = {
      legal_name: 'New Name Company',
      zip: '90210',
      federal_contractor: 'No',
      industry: 'Some Industry',
      num_of_employees: '10',
      pt_employees: '5',
      hrly_employees: '2',
      slry_employees: '8',
      revenue: 1000000,
      independent_contractor_count: '10',
      have_handbook: 'No',
      total_payroll: 120000,
      have_gen_liab_insurance: 'Yes',
      have_epli: 'Yes',
      have_pro_liab_insurance: 'No',
      have_cyber_liab_insurance: 'No',
      have_wc_insurance: `I'm not sure`,
    };
    company.setFromAuditAnswers(answers, {
      industries: [{ value: answers.industry }],
    });

    // Still the same
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    // Overwritten
    expect(company.name).to.equal(answers.legal_name);
    expect(company.profile.zip).to.equal(answers.zip);
    expect(company.profile.is_federal_contractor).to.be.false;
    expect(company.profile.num_of_part_time_employees).to.equal(+answers.pt_employees);
    expect(company.profile.num_of_full_time_hourly_employees).to.equal(+answers.hrly_employees);
    expect(company.profile.num_of_full_time_salary_employees).to.equal(+answers.slry_employees);
    expect(company.profile.estimated_annual_revenue).to.equal(answers.revenue);
    expect(company.profile.num_of_contractors).to.equal(+answers.independent_contractor_count);
    expect(company.profile.customer_provided_handbook).to.be.false;
    expect(company.profile.estimated_monthly_payroll).to.equal(answers.total_payroll / 12);

    expect(company.self_reported_insurance.general).to.be.true;
    expect(company.self_reported_insurance.epli).to.be.true;
    expect(company.self_reported_insurance.pro_liab).to.be.false;
    expect(company.self_reported_insurance.cyber).to.be.false;
    expect(company.self_reported_insurance.workers).to.equal(null);
  });

  it('Maps Qna data for SalesHrAudit', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };

    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    const answers = {
      hasSexualHarassmentPolicy: 'No', // 5pts
      hasHandbook: 'Yes', // 5pts
      hasPolicies: 'No', // 5pts
      hasI9sForAllEmployees: 'Yes', // 20pts
      hasLaborPosters: 'Yes', // 15pts
      providesOfferLetters: 'Yes', // 5pts
      hasEmployeeFiles: 'No', // 5pts
      hasWorkersCompensation: 'Yes', // 5pts
      hasJobDescriptions: 'No', // 10pts
      hasTerminatedEmployee: 'No', // 0pts
      documentsVerbalAndWrittenwarnings: 'No', // 10pts
      providesTerminationRequirements: 'Yes', // 10pts
      providesAnnualReviewsForEmployees: 'Yes', // 5pts
    };

    company.setFromSalesHrAuditAnswers(answers);

    expect(company.profile.customer_provided_handbook).to.be.true;
    expect(company.self_reported_insurance.workers).to.be.true;
    expect(company.salesHrAuditScore).to.equal(65);

    const answersAllNo = {
      hasSexualHarassmentPolicy: 'No',
      hasHandbook: 'No',
      hasPolicies: 'No',
      hasI9sForAllEmployees: 'No',
      hasLaborPosters: 'No',
      providesOfferLetters: 'No',
      hasEmployeeFiles: 'No',
      hasWorkersCompensation: 'No',
      hasJobDescriptions: 'No',
      hasTerminatedEmployee: 'No',
      documentsVerbalAndWrittenwarnings: 'No',
      providesTerminationRequirements: 'No',
      providesAnnualReviewsForEmployees: 'No',
    };

    company.setFromSalesHrAuditAnswers(answersAllNo);

    expect(company.profile.customer_provided_handbook).to.be.false;
    expect(company.self_reported_insurance.workers).to.be.false;
    expect(company.salesHrAuditScore).to.equal(0);
  });

  it('setSalesforceAccountId sets settings.salesforceAccountId', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };

    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    company.setSalesforceCompanyAccountId('test');
    expect(company.settings.salesforceCompanyAccountId).to.equal('test');
  });

  it('setSalesforceLeadId sets settings.salesforceLeadId', async () => {
    const companyData = {
      name: 'South Bend Construction',
      profile: {
        phone: '+1 (323) 213 - 4567',
      },
    };

    const company = new manager.Company(companyData);
    expect(company.name).to.equal(companyData.name);
    expect(company.profile.phone).to.equal(companyData.profile.phone.replace(/[^\+\d]/g, ''));

    company.setSalesforceLeadId('test');
    expect(company.settings.salesforceLeadId).to.equal('test');
  });
});
