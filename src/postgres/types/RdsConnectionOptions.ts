import { RdsManagerSslStatus } from './RdsManagerSslStatus';

export interface RdsConnectionOptions {
  rdsUrl: string;
  rdsReadonlyUrl?: string;
  ssl: RdsManagerSslStatus;
}
