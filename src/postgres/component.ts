import {
  bind,
  Binding,
  BindingScope,
  Component,
  config,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import debugFactory from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { ConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { RdbBindings } from './keys';
import { RdsConnectionOptions } from './types/RdsConnectionOptions';
import { RdsManagerSslStatus } from './types/RdsManagerSslStatus';
import { Writeable } from './types/Writeable';
const debug = debugFactory('bambee:models:RdsComponent');

@bind({
  tags: { [ContextTags.KEY]: RdbBindings.COMPONENT },
  scope: BindingScope.SINGLETON,
})
export class RdsComponent implements Component {
  lifeCycleObservers = [TypeOrmLifeCycleManager];
  bindings: Binding[] = [];
  constructor(@config() private options: RdsConnectionOptions) {
    const connectionManager = new ConnectionManager();

    const baseConfig: Writeable<PostgresConnectionOptions> = {
      type: 'postgres',
      entities: [__dirname + '/entities/*.entity.js'],
    };
    if (options.ssl === RdsManagerSslStatus.AllowUnauthorized) {
      baseConfig.ssl = {
        rejectUnauthorized: false,
      };
    } else if (options.ssl === RdsManagerSslStatus.Disabled) {
      // noop, don't use ssl
    } else {
      baseConfig.ssl = {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, '../../ssl/rds-combined-ca-bundle.pem')).toString(),
      };
    }

    connectionManager.create({ name: 'default', url: options.rdsUrl, ...baseConfig });

    connectionManager.create({ name: 'readonly', url: options.rdsReadonlyUrl || options.rdsUrl, ...baseConfig });
    this.bindings.push(new Binding<ConnectionManager>(RdbBindings.MANAGER).to(connectionManager));
  }
}

@lifeCycleObserver('datasource', {
  scope: BindingScope.SINGLETON,
})
export class TypeOrmLifeCycleManager implements LifeCycleObserver {
  constructor(
    @inject(RdbBindings.MANAGER)
    private manager: ConnectionManager,
  ) {}

  async start(): Promise<void> {
    debug('RdsComponent:start()');
    await Promise.all(this.manager.connections.map((c) => c.connect()));
  }

  async stop(): Promise<void> {
    debug('RdsComponent:stop()');
    await Promise.all(this.manager.connections.map((c) => c.close()));
  }
}
