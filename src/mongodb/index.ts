import { Schema as MongooseSchema, Types as MongooseTypes } from 'mongoose';
import { ModelManager } from './ModelManager';
import type { Documents } from './types';
export type {Documents }
export { MongooseTypes };
export { MongooseSchemaTypes };
const MongooseSchemaTypes = MongooseSchema.Types;
export default new ModelManager();
