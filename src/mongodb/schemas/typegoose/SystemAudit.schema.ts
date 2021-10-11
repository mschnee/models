import { index, modelOptions, prop, Ref } from '@typegoose/typegoose';

@modelOptions({ options: { allowMixed: 0 } })
@index({ name: 1, eventTime: -1 })
export class SystemAudit {
  @prop({ required: true, index: true })
  name: string;

  @prop({ ref: 'User', required: true })
  _eventBy: Ref<any>;

  @prop({ required: true })
  eventTime: Date;

  @prop()
  eventEndTime?: Date;
}
