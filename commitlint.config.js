//=============================================================================
//Licensed Materials - Property of Bambee
//(C) Copyright Bambee 2020,2021
//All Rights Reserved
//=============================================================================

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['BAM-', 'DEBT-', 'EXPRS-', 'DAT-', 'SSC-', 'HRC-', 'ACQ-'],
    },
  },
};
