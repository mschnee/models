import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Qna', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Maps company data to Company Overview', async () => {
    const companyData = {
      legalName: 'ActualName Company',
      profile: {
        zip: '91342',
        state: 'CA',
        city: 'Glendale',
        address: '1234 address',
        industry: 'Industry of Industry',
        dba: 'dba',
        has_commissioned_workers: false,
      },
    };
    const qnaData = {
      type: 'CompanyOverview',
      typeVersion: 1,
    };
    const company = new manager.Company(companyData);
    const qna = new manager.Qna(qnaData);
    qna.setFromCompanyData(company, {
      industries: [
        {
          value: companyData.profile.industry,
          alias: companyData.profile.industry,
        },
      ],
    });

    const { answers } = qna;

    expect(answers.legalName).to.equal(company.name);
    expect(answers.dba).to.equal(company.profile.dba);
    expect(answers.companyAddress.zip).to.equal(company.profile.zip);
    expect(answers.companyAddress.state).to.equal(company.profile.state);
    expect(answers.companyAddress.city).to.equal(company.profile.city);
    expect(answers.companyAddress.address).to.equal(company.profile.address);
    expect(answers.industry).to.eql([company.profile.industry]);
    expect(answers.hasCommissionWorkers).to.equal('No');
  });

  it('Maps company data to Audit (version 2)', async () => {
    const companyData = {
      legalName: 'ActualName Company',
      profile: {
        zip: '91342',
        is_federal_contractor: false,
        industry: 'Industry, yo',
        num_of_part_time_employees: 2,
        num_of_full_time_hourly_employees: 5,
        num_of_full_time_salary_employees: 3,
        estimated_annual_revenue: 120000,
        num_of_contractors: 5,
        customer_provided_handbook: false,
        estimated_monthly_payroll: 10000,
      },
      self_reported_insurance: {
        general: true,
        epli: true,
        pro_liab: false,
        cyber: false,
        workers: null,
      },
    };
    const qnaData = {
      type: 'Audit',
      typeVersion: 2,
    };
    const company = new manager.Company(companyData);
    const qna = new manager.Qna(qnaData);
    qna.setFromCompanyData(company);

    const { answers } = qna;
    const { profile } = company;

    expect(answers.legal_name).to.equal(company.name);
    expect(answers.zip).to.equal(profile.zip);
    expect(answers.federal_contractor).to.equal('No');
    expect(answers.pt_employees).to.equal(`${profile.num_of_part_time_employees}`);
    expect(answers.ft_employees).to.equal(`${profile.num_of_full_time_salary_employees}`);
    expect(answers.hrly_employees).to.equal(`${profile.num_of_full_time_hourly_employees}`);
    expect(answers.slry_employees).to.equal(`${profile.num_of_full_time_salary_employees}`);
    expect(answers.revenue).to.equal(profile.estimated_annual_revenue);
    expect(answers.independent_contractor).to.equal('Yes');
    expect(answers.independent_contractor_count).to.equal(profile.num_of_contractors);
    expect(answers.have_handbook).to.equal('No');
    expect(answers.total_payroll).to.equal(120000);
    expect(answers.onboarding_paperwork_handbook).to.equal('No');
    expect(answers.have_gen_liab_insurance).to.equal('Yes');
    expect(answers.have_epli).to.equal('Yes');
    expect(answers.have_pro_liab_insurance).to.equal('No');
    expect(answers.have_cyber_liab_insurance).to.equal('No');
    expect(answers.have_wc_insurance).to.equal(`I'm not sure`);
  });

  it('Maps company data to Audit (version 3)', async () => {
    const companyData = {
      legalName: 'ActualName Company',
      profile: {
        zip: '91342',
        is_federal_contractor: false,
        industry: 'Industry, yo',
        num_of_part_time_employees: 2,
        num_of_full_time_hourly_employees: 5,
        num_of_full_time_salary_employees: 3,
        estimated_annual_revenue: 120000,
        num_of_contractors: 5,
        customer_provided_handbook: false,
        estimated_monthly_payroll: 10000,
      },
      self_reported_insurance: {
        general: true,
        epli: true,
        pro_liab: false,
        cyber: false,
        workers: null,
      },
    };
    const qnaData = {
      type: 'Audit',
      typeVersion: 3,
    };
    const company = new manager.Company(companyData);
    const qna = new manager.Qna(qnaData);
    qna.setFromCompanyData(company, {
      industries: [
        {
          value: companyData.profile.industry,
          alias: companyData.profile.industry,
        },
      ],
    });

    const { answers } = qna;
    const { profile } = company;

    expect(answers.legal_name).to.equal(company.name);
    expect(answers.zip).to.equal(profile.zip);
    expect(answers.federal_contractor).to.equal('No');
    expect(answers.employeeBreakdown.numOfPartTimeEmployees).to.equal(profile.num_of_part_time_employees);
    expect(answers.employeeBreakdown.numOfFullTimeSalaryEmployees).to.equal(profile.num_of_full_time_salary_employees);
    expect(answers.employeeBreakdown.numOfFullTimeHourlyEmployees).to.equal(profile.num_of_full_time_hourly_employees);
    expect(answers.employeeBreakdown.numOfFullTimeSalaryEmployees).to.equal(profile.num_of_full_time_salary_employees);
    expect(answers.revenue).to.equal(profile.estimated_annual_revenue);
    expect(answers.independent_contractor).to.equal('Yes');
    expect(answers.independent_contractor_count).to.equal(profile.num_of_contractors);
    expect(answers.total_payroll).to.equal(120000);
    expect(answers.have_gen_liab_insurance).to.equal('Yes');
    expect(answers.have_epli).to.equal('Yes');
    expect(answers.have_pro_liab_insurance).to.equal('No');
    expect(answers.have_cyber_liab_insurance).to.equal('No');
    expect(answers.have_wc_insurance).to.equal(`I'm not sure`);
  });
});
