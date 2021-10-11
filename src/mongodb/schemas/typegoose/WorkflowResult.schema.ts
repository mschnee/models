import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';
import { WorkflowResultOutcome } from '../../../types/workflows';

@modelOptions({ options: { allowMixed: 0 } })
export class WorkflowResult {
  @prop({ required: true })
  name: string;

  @prop({ required: true, type: mongoose.Schema.Types.Mixed })
  inputParams: Record<any, unknown>;

  @prop({ required: true, type: mongoose.Schema.Types.Mixed })
  result: Record<any, unknown>;

  @prop({ default: Date.now })
  executedAt: Date;

  @prop({ enum: Object.values(WorkflowResultOutcome), default: null, addNullToEnum: true })
  outcome?: WorkflowResultOutcome;

  @prop({ ref: 'User' })
  outcomeBy?: Ref<any>;

  @prop({ default: null })
  outcomeDate?: Date;
}
