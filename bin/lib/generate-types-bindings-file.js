const path = require('path');
const fs = require('fs');
const { FILE_HEADER } = require('./consts');

const BINDINGS_FILE = path.join(__dirname, '../../src/mongodb/types/bindings.generated.ts');

module.exports = async function generate_types_bindings_file(spec) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(BINDINGS_FILE, { flags: 'w', encoding: 'utf8' });
    wstream.on('finish', () => {
      resolve();
    });
    wstream.on('error', (e) => {
      reject(e);
    });
    wstream.write(FILE_HEADER);
    wstream.write(`import { BindingKey } from '@loopback/core';\n`);
    wstream.write(`import * as mongoose from 'mongoose';\n`);
    wstream.write(`import * as Models from './models.generated';\n\n`);

    // TODO: there's a small bug in @loopback/repository where it
    // takes a shortcut to determining a component's key,
    // this should be `com
    wstream.write(`import { MongooseComponent } from '../Mongoose.component';\n`);
    wstream.write(`export const COMPONENT = BindingKey.create<MongooseComponent>('components.MongooseComponent');\n\n`);

    for (const name of spec.typegoose.schemas) {
      wstream.write(
        `export const ${name} = BindingKey.create<Models.${name}>('com.bambee.models.typegoose.${name}');\n`,
      );
    }

    for (const name of spec.mongoose.schemas) {
      wstream.write(
        `export const ${name} = BindingKey.create<mongoose.Model<any>>('com.bambee.models.mongoose.${name}');\n`,
      );
    }
    for (const name of spec.mongoose.discriminators.Event) {
      wstream.write(
        `export const ${name}Event = BindingKey.create<mongoose.Model<any>>('com.bambee.models.mongoose.Event.${name}');\n`,
      );
    }
    for (const name of spec.mongoose.discriminators.Configuration) {
      wstream.write(
        `export const ${name}Configuration = BindingKey.create<mongoose.Model<any>>('com.bambee.models.mongoose.Configuration.${name}');\n`,
      );
    }
    console.log('Wrote', BINDINGS_FILE);
    wstream.end();
  });
};
