import { ApiServerBindings } from '@bambeehr/api-core';
import type * as winston from 'winston';
import {
    BindingScope,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
  } from '@loopback/core';
import { Bindings } from './types';
import type {MongooseComponent} from './Mongoose.component';

@lifeCycleObserver('mongoose-component-lf-observer', {
    scope: BindingScope.SINGLETON,
  })
  export class MongooseComponentLifecycleObserver implements LifeCycleObserver {
    constructor(
      @inject(Bindings.COMPONENT)
      private component: MongooseComponent,
      @inject(ApiServerBindings.Services.Logger) protected logger: winston.Logger,
    ) {}
  
    async start(): Promise<void> {
    this.logger.info('[MongooseComponent] lifecycle: start()')
      return this.component.start();
    }
  
    async stop(): Promise<void> {
    this.logger.info('[MongooseComponent] lifecycle: stop()')
      return this.component.stop();
    }
  }
  