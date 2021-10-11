const path = require('path');
const fs = require('fs');
const { FILE_HEADER } = require('./consts');
const COMPONENT_FILE = path.join(__dirname, '../../src/mongodb/Mongoose.component.ts');

const SECTION1 = `
import {
  Application,
  bind,
  Binding,
  BindingScope,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import debugFactory from 'debug';
import { Connection, ConnectOptions, createConnection } from 'mongoose';
import { Bindings, Schemas, Models } from './types';


const debug = debugFactory('bambee:models:MongooseComponent');

export interface MongooseComponentConfig {
  uri: string;
  options?: ConnectOptions
}

@bind({
  tags: {[ContextTags.KEY]: Bindings.COMPONENT},
  scope: BindingScope.SINGLETON,
})
export class MongooseComponent implements Component {
  lifeCycleObservers = [MongooseComponentLifecycleObserver];
  mongooseConnection: Connection;
  bindings: Binding[] = [];
  private started = false;

  constructor(
    @config()
    readonly configuration: MongooseComponentConfig,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    readonly app: Application,
  ) {
    debug('MongooseComponent:constructed()');
  }

  async getDbStats(): Promise<any> {
    return this.mongooseConnection.db.stats();
  }

  async stop() {
    if (!this.started) {
      return;
    }
    this.started = false;
    debug('MongooseComponent:stop()');
    await this.mongooseConnection.close();
  }

  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    debug('MongooseComponent:start()')
    this.mongooseConnection = await createConnection(
      this.configuration.uri,
      this.configuration.options,
    );
`;

const SECTION2 = `@lifeCycleObserver('mongoose-component-lf-observer', {
  scope: BindingScope.SINGLETON,
})
export class MongooseComponentLifecycleObserver implements LifeCycleObserver {
  constructor(
    @inject(Bindings.COMPONENT)
    private component: MongooseComponent,
  ) {}

  async start(): Promise<void> {
    return this.component.start();
  }

  async stop(): Promise<void> {
    return this.component.stop();
  }
}
`;

module.exports = async function generate_component_file(spec) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(COMPONENT_FILE, { flags: 'w', encoding: 'utf8' });
    wstream.on('finish', () => {
      resolve();
    });
    wstream.on('error', (e) => {
      reject(e);
    });
    wstream.write(FILE_HEADER);
    for (const name of spec.typegoose.schemas) {
      wstream.write(`import ${name}Schema from './schemas/typegoose/${name}.schema';\n`);
    }
    wstream.write(SECTION1);

    wstream.write(`    /* Typegoose Schemas */\n`);
    for (const name of spec.typegoose.schemas) {
      wstream.write(
        `    {\n      const model = getModelForClass(${name}Schema, { options: { customName: '${name}' }, existingConnection: this.mongooseConnection });\n      this.app.bind<ReturnModelType<typeof ${name}Schema>>(Bindings.${name}).to(model);\n    }\n`,
      );
    }
    wstream.write(`\n`);

    wstream.write(`    /* Mongoose Schemas */\n`);
    for (const name of spec.mongoose.schemas) {
      wstream.write(
        `    {\n      const model = this.mongooseConnection.model('${name}', Schemas.${name});\n      this.app.bind(Bindings.${name}).to(model);\n    }\n`,
      );
    }
    wstream.write(`\n`);

    wstream.write(`    /* Mongoose Event Discriminators */\n`);
    wstream.write(`    const eventModel = await this.app.get(Bindings.Event);\n`);
    wstream.write(`    const configurationModel = await this.app.get(Bindings.Configuration);\n`);
    for (const name of spec.mongoose.discriminators.Event) {
      wstream.write(
        `    this.app.bind(Bindings.${name}Event).to(eventModel.discriminator('${name}', Schemas.${name}Event));\n`,
      );
    }
    wstream.write(`\n`);

    wstream.write(`    /* Mongoose Configuration Discriminators */\n`);
    for (const name of spec.mongoose.discriminators.Configuration) {
      wstream.write(
        `    this.app.bind(Bindings.${name}Configuration).to(configurationModel.discriminator('${name}', Schemas.${name}Configuration));\n`,
      );
    }
    wstream.write(`\n`);

    wstream.write(`  }\n`);
    wstream.write(`}\n`);
    wstream.write(SECTION2);
    wstream.end();
  });
};
