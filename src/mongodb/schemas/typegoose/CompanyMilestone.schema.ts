import { index, prop, Ref } from '@typegoose/typegoose';

@index({ _company: 1, name: 1 })
export class CompanyMilestone {
  @prop({ enum: [null, 'bci-setup'] })
  group?: string;

  @prop({ default: 0 })
  order: number;

  @prop({ ref: 'Company', required: true })
  _company: Ref<any>;

  @prop({ index: true, required: true })
  name: string;

  @prop({ required: true })
  label: string;

  @prop()
  description: string;

  @prop()
  icon: string;

  @prop({ required: true })
  action: string;

  @prop({ default: 'Get Started' })
  actionText: string;

  @prop({ default: 'route' })
  actionType: string;

  @prop()
  progress: number;

  @prop({ default: Date.now })
  createdAt: Date;

  @prop()
  completedAt: Date;
}
