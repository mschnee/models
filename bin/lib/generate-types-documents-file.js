const path = require('path');
const fs = require('fs');
const { FILE_HEADER } = require('./consts');
const DOCUMENTS_FILE = path.join(__dirname, '../../src/mongodb/types/documents.generated.ts');

module.exports = async function generate_types_documents_file(spec) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(DOCUMENTS_FILE, { flags: 'w', encoding: 'utf8' });
    wstream.on('finish', () => {
      resolve();
    });
    wstream.on('error', (e) => {
      reject(e);
    });
    wstream.write(FILE_HEADER);
    wstream.write(`import { DocumentType } from '@typegoose/typegoose';\n\n`);

    for (const name of spec.typegoose.schemas) {
      wstream.write(`import ${name}Schema from '../schemas/typegoose/${name}.schema';\n`);
    }
    wstream.write('\n');

    for (const name of spec.typegoose.schemas) {
      wstream.write(`export type ${name} = DocumentType<${name}Schema>;\n`);
    }
    wstream.write('\n');

    /**
     * This is just for completions' sake: so that api and apiv2 can use
     * all of our models with a type alias that we can change here
     * as we update them.  E.g., when we convert Auth to typegoose,
     * apiv2 can still use auth: Mongo.Model.Auth;
     */
    for (const name of spec.mongoose.schemas) {
      wstream.write(`export type ${name} = any;\n`);
    }
    wstream.write('\n');

    for (const name of spec.mongoose.discriminators.Event) {
      wstream.write(`export type ${name}Event = any;\n`);
    }
    wstream.write('\n');

    for (const name of spec.mongoose.discriminators.Configuration) {
      wstream.write(`export type ${name}Configuration = any;\n`);
    }
    wstream.write('\n');

    console.log('Wrote', DOCUMENTS_FILE);
    wstream.end();
  });
};
