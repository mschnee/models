import RdsManager, { Entity, RdsConnectionOptions, RdsManagerSslStatus } from './dist/postgres/singleton';
import * as Types from './dist/types';

export default RdsManager;

export { Entity, Types, RdsManagerSslStatus, RdsConnectionOptions };
