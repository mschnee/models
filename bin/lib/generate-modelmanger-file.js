const path = require('path');
const fs = require('fs');
const { FILE_HEADER } = require('./consts');
const MODELMANAGER_FILE = path.join(__dirname, '../../src/mongodb/ModelManager.ts');

const MODEL_MANAGER_SECTION1 = `
import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import debugFactory from 'debug';
import { Connection, ConnectOptions, Model, Schema, SchemaDefinition, createConnection } from 'mongoose';
import { Schemas, Models } from './types';
import { IModelOptions } from '@typegoose/typegoose/lib/types';

const log = debugFactory('com:bambee:models:ModelManager');

`;

const MODEL_MANAGER_SECTION2 = `
  private connection: Connection = null;
  private isSetup = false;

  buildTestModel(name: string, s: SchemaDefinition) {
    let m = null
    try {
      m = this.connection.model(name);
    } catch (e) {
      // noop
    }
    if (m) {
      return m;
    } else {
      return this.connection.model(name, new Schema(s));
    }
  }

  async setup(uri: string, options?: ConnectOptions) {
    if (this.isSetup) {
      return;
    }

    this.connection = await createConnection(uri, options);
    this.buildModels();
  }

  async close() {
    await this.connection.close();
  }
`;
const MODEL_MANAGER_GETTER_ERROR = `    if (!this.connection) {
      throw new Error('Must set a mongoose connection first')  ;
  }
`;

module.exports = async function generate_modelmanager_file(spec) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(MODELMANAGER_FILE, { flags: 'w', encoding: 'utf8' });
    wstream.on('finish', () => {
      resolve();
    });
    wstream.on('error', (e) => {
      reject(e);
    });
    wstream.write(FILE_HEADER);
    wstream.write(MODEL_MANAGER_SECTION1);
    {
      for (const name of spec.typegoose.schemas) {
        wstream.write(`import ${name}Schema from './schemas/typegoose/${name}.schema';\n`);
      }
    }

    {
      // being able to collapse blocks is nice, isn't it?
      // should this be in a new function?
      wstream.write(`export class ModelManager {\n`);
      for (const name of spec.typegoose.schemas) {
        wstream.write(`  public ${name}: ReturnModelType<typeof ${name}Schema>;\n`);
      }
      for (const name of spec.mongoose.schemas) {
        wstream.write(`  public ${name}: Model<any>;\n`);
      }
      for (const name of spec.mongoose.discriminators.Event) {
        wstream.write(`  public ${name}Event: Model<any>;\n`);
      }
      for (const name of spec.mongoose.discriminators.Configuration) {
        wstream.write(`  public ${name}Configuration: Model<any>;\n`);
      }
    }

    wstream.write(MODEL_MANAGER_SECTION2);

    {
      // being able to collapse blocks is nice, isn't it?
      // should this be in a new function?
      wstream.write(`  buildModels() {\n`);
      wstream.write(`    const configOptions: Partial<IModelOptions> = {};\n`);
      wstream.write(`    configOptions.existingConnection = this.connection;\n\n`);

      wstream.write(`    /* Typegoose Schemas */\n`);
      for (const name of spec.typegoose.schemas) {
        wstream.write(
          `    this.${name} = getModelForClass(${name}Schema, { options: { customName: '${name}' }, ...configOptions });\n`,
        );
      }
      wstream.write(`\n`);

      wstream.write(`    /* Mongoose Schemas */\n`);
      for (const name of spec.mongoose.schemas) {
        wstream.write(`    this.${name} = this.connection.model('${name}', Schemas.${name});\n`);
      }
      wstream.write(`\n`);

      wstream.write(`    /* Mongoose Event Discriminators */\n`);
      for (const name of spec.mongoose.discriminators.Event) {
        wstream.write(`    this.${name}Event = this.Event.discriminator('${name}', Schemas.${name}Event);\n`);
      }
      wstream.write(`\n`);

      wstream.write(`    /* Mongoose Configuration Discriminators */\n`);
      for (const name of spec.mongoose.discriminators.Configuration) {
        wstream.write(
          `    this.${name}Configuration = this.Configuration.discriminator('${name}', Schemas.${name}Configuration);\n`,
        );
      }
      wstream.write(`\n`);
    }
    wstream.write(`  }\n\n`);

    wstream.write(`}\n`);

    console.log('Wrote', MODELMANAGER_FILE);
    wstream.end();
  });
};
