import { BindingKey } from '@loopback/core';
import { ConnectionManager } from 'typeorm';
import { RdsComponent } from './component';

export namespace RdbBindings {
  export const MANAGER = BindingKey.create<ConnectionManager>('com.bambee.models.rds.connectionManager');
  export const COMPONENT = BindingKey.create<RdsComponent>('com.bambee.models.rds.component');
}
