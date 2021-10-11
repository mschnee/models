import { index, prop, Ref } from '@typegoose/typegoose';

export class PolicyComment {
  @prop({ required: true, trim: true })
  commentId: string;

  @prop({ required: true })
  content: string;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop({ ref: 'User', required: true })
  _createdBy?: Ref<any>;
}

@index({ _company: 1, _policy: 1, policyVersion: 1 })
export class PolicyThread {
  @prop({ ref: 'Company', required: true })
  _company: Ref<any>;

  @prop({ ref: 'Policy', required: true })
  _policy: Ref<any>;

  @prop({ required: true })
  policyVersion: number;

  @prop({ required: true, trim: true })
  threadId: string;

  @prop({ type: PolicyComment })
  comments?: PolicyComment[];
}
