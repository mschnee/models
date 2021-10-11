import * as Entity from './entities';
import { RdsManager } from './RdsManager';
import { RdsConnectionOptions } from './types/RdsConnectionOptions';
import { RdsManagerSslStatus } from './types/RdsManagerSslStatus';
export { Entity };
export { RdsManagerSslStatus, RdsConnectionOptions };

export default new RdsManager();
