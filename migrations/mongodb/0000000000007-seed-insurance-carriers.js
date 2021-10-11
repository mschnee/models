const path = require('path');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');
const connect = require('../lib/connect');

module.exports.description = 'Adds Insurance Carriers';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Running 0000000000007-seed-insurance-carriers');
  const db = await connect();

  const csv = require('csvtojson');
  const currentPath = __dirname;

  const carrierList = await csv({
    noheader: false,
    output: 'csv',
  }).fromFile(path.resolve(`${currentPath}/../mongodb-data/7-insurance-carriers.csv`).replace('dist', 'src'));

  const carrierPayload = {};

  for (const index in carrierList) {
    // create things...
    const [carrierName, insuranceTypeString] = carrierList[index];
    if (!Object.prototype.hasOwnProperty.call(carrierPayload, carrierName)) {
      carrierPayload[carrierName] = {
        name: carrierName,
        logoUrl: null,
        carrierUrl: null,
        knownLineTypes: [],
      };
    }

    if (insuranceTypeString && insuranceTypeString.length) {
      const lineType = mapType(insuranceTypeString);
      if (!lineType) {
        throw new Error(`Could not map type ${insuranceTypeString}`);
      }
      const existing = carrierPayload[carrierName].knownLineTypes.find((t) => t.lineType === lineType);
      if (!existing) {
        carrierPayload[carrierName].knownLineTypes.push({
          lineType,
          canBrokerOfRecord: true,
        });
      }
    }
  }

  // now, insert them all.
  await db.collection('insurancecarriers').insertMany(Object.values(carrierPayload));
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Reverting 0000000000007-seed-insurance-carriers');
  const db = await connect();
  await db.collection('insurancecarriers').deleteMany({});
};

function mapType(insuranceType) {
  switch (insuranceType.toLowerCase()) {
    case 'Employment Practices Liability Insurance'.toLowerCase():
      return 'employment-practices-liability-insurance';
    case 'General Liability Insurance'.toLowerCase():
      return 'general-liability-insurance';
    case 'Workers Compensation Insurance'.toLowerCase():
      return 'workers-compensation-insurance';
    case 'Cyber Insurance'.toLowerCase():
      return 'cyber-insurance';
    case 'Professional Liability Insurance'.toLowerCase():
      return 'professional-liability-insurance';
    case 'Pollution Liability Insurance'.toLowerCase():
      return 'pollution-liability-insurance';
    case 'Environmental Liability Insurance'.toLowerCase():
      return 'environmental-liability-insurance';
    case 'Product Liability'.toLowerCase():
      return 'product-liability';
    case 'Business Owners Policy'.toLowerCase():
      return 'business-owners-policy';
    case 'Commercial Property'.toLowerCase():
      return 'commercial-property';
    case 'Commercial Auto'.toLowerCase():
      return 'commercial-auto';
    case 'Directors & Officers Insurance'.toLowerCase():
      return 'directors-and-officers-insurance';
    case 'Liquor Liability'.toLowerCase():
      return 'liquor-liability';
    case 'Special Events'.toLowerCase():
      return 'special-events';
    case 'Inland Marine'.toLowerCase():
      return 'inland-marine';
    case 'Ocean Marine'.toLowerCase():
      return 'ocean-marine';
    case 'Stock Through Put'.toLowerCase():
      return 'stock-through-put';
    case 'Medical Malpractice'.toLowerCase():
      return 'medical-malpractice';
    case 'Equipment Breakdown'.toLowerCase():
      return 'equipment-breakdown';
    case 'Business Interruption'.toLowerCase():
      return 'business-interruption';
    case 'Garage Liability'.toLowerCase():
      return 'garage-liability';
    case 'Dealers Open Lot'.toLowerCase():
      return 'dealers-open-lot';
    case 'Hired and Non Owned Auto'.toLowerCase():
      return 'hired-and-non-owned-auto';
    case 'Fidelity Bond'.toLowerCase():
      return 'fidelity-bond';
    case 'Fiduciary Bond'.toLowerCase():
      return 'fiduciary-bond';
    case 'Surety Bond'.toLowerCase():
      return 'surety-bond';
    case 'Excess Property'.toLowerCase():
      return 'excess-property';
    case 'Excess Casualty'.toLowerCase():
      return 'excess-casualty';
    case 'Umbrella'.toLowerCase():
      return 'umbrella';
    case 'Difference In Conditions'.toLowerCase():
      return 'difference-in-conditions';
    case 'Personal Lines'.toLowerCase():
      return 'personal-lines';
    case 'Program Administrator'.toLowerCase():
      return 'program-administrator';
  }
}
