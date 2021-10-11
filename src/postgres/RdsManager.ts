import * as fs from 'fs';
import * as path from 'path';
import { Connection, ConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { RdsConnectionOptions } from './types/RdsConnectionOptions';
import { RdsManagerSslStatus } from './types/RdsManagerSslStatus';
import { Writeable } from './types/Writeable';

export class RdsManager {
  _roConfig: PostgresConnectionOptions = null;
  _rwConfig: PostgresConnectionOptions = null;

  _manager: ConnectionManager = null;

  setup(options: RdsConnectionOptions, pgOptions?: PostgresConnectionOptions): void {
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

    this._rwConfig = { name: 'default', url: options.rdsUrl, ...baseConfig };
    this._roConfig = { name: 'readonly', url: options.rdsReadonlyUrl || options.rdsUrl, ...baseConfig };

    this._manager = new ConnectionManager();
    this._manager.create(this._rwConfig);
    this._manager.create(this._roConfig);
  }

  async start(): Promise<void> {
    await Promise.all(this._manager.connections.map((c) => c.connect()));
  }

  async stop(): Promise<void> {
    await Promise.all(this._manager.connections.map((c) => c.close()));
  }

  get roConnection(): Connection {
    if (!this._manager) {
      throw new Error('RdsManager has not been setup()');
    }
    return this._manager.get('readonly');
  }

  get rwConnection(): Connection {
    if (!this._manager) {
      throw new Error('RdsManager has not been setup()');
    }
    return this._manager.get('default');
  }
}
