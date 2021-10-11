import { pre, prop, Ref } from '@typegoose/typegoose';

@pre<PolicyBundle>('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  return next();
})
export class PolicyBundle {
  @prop({ required: true, trim: true })
  name: string;

  @prop({ ref: 'Company', index: true })
  _company: Ref<any>;

  @prop({ ref: 'Policy', index: true, default: [] })
  _policies?: Ref<any>[];

  @prop({ default: false })
  isDefault?: boolean;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop({ ref: 'User' })
  _createdBy?: Ref<any>;

  @prop({ default: null })
  updatedAt?: Date;

  @prop({ ref: 'User', default: null })
  _updatedBy?: Ref<any>;

  @prop({ default: null })
  publishedAt?: Date;

  @prop({ ref: 'User', default: null })
  _publishedBy?: Ref<any>;

  @prop({ default: null })
  deletedAt?: Date;

  @prop({ ref: 'User', default: null })
  _deletedBy?: Ref<any>;
}
