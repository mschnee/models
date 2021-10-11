const path = require('path');
const fs = require('fs');
const { FILE_HEADER } = require('./consts');
const SCHEMAS_FILE = path.join(__dirname, '../../src/mongodb/types/schemas.generated.ts');

module.exports = async function generate_types_schemas_file(spec) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(SCHEMAS_FILE, { flags: 'w', encoding: 'utf8' });
    wstream.on('finish', () => {
      resolve();
    });
    wstream.on('error', (e) => {
      reject(e);
    });
    wstream.write(FILE_HEADER);

    // Build the imports
    wstream.write('/* Typegoose schemas */\n');
    for (const name of spec.typegoose.schemas) {
      wstream.write(`import ${name} from '../schemas/typegoose/${name}.schema';\n`);
    }
    wstream.write('\n');

    wstream.write('/* Mongoose schemas */\n');
    for (const name of spec.mongoose.schemas) {
      wstream.write(`import * as ${name} from '../schemas/mongoose/${name}Schema';\n`);
    }

    wstream.write('/* Mongoose Event discriminators */\n');
    for (const name of spec.mongoose.discriminators.Event) {
      wstream.write(`import * as ${name}Event from '../schemas/mongoose/discriminators/Event/${name}Schema';\n`);
    }
    wstream.write('\n');

    wstream.write('/* Mongoose Configuration discriminators */\n');
    for (const name of spec.mongoose.discriminators.Configuration) {
      wstream.write(
        `import * as ${name}Configuration from '../schemas/mongoose/discriminators/Configuration/${name}Schema';\n`,
      );
    }
    wstream.write('\n');

    /**
     * Begin exports
     */
    wstream.write(`export const Schemas = {\n`);
    wstream.write('/* Typegoose schemas */\n');
    for (const name of spec.typegoose.schemas) {
      wstream.write(`  ${name},\n`);
    }
    wstream.write('\n');

    wstream.write('/* Mongoose schemas */\n');
    for (const name of spec.mongoose.schemas) {
      wstream.write(`  ${name},\n`);
    }

    wstream.write('/* Mongoose Event discriminators */\n');
    for (const name of spec.mongoose.discriminators.Event) {
      wstream.write(`  ${name}Event,\n`);
    }
    wstream.write('\n');

    wstream.write('/* Mongoose Configuration discriminators */\n');
    for (const name of spec.mongoose.discriminators.Configuration) {
      wstream.write(`  ${name}Configuration,\n`);
    }
    wstream.write('\n');
    wstream.write(`};\n`);

    console.log('Wrote', SCHEMAS_FILE);
    wstream.end();
  });
};
