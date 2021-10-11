import { pre, prop, Ref } from '@typegoose/typegoose';

export class CompanyScoreRawValues {
  @prop()
  highImpactActionItemsCount: number;

  @prop()
  normalImpactActionItemsCount: number;

  @prop()
  recordKeepingPercent: number;

  @prop()
  recordKeepingPercentFloat: number;

  @prop()
  reportCardCompletionPercent: number;

  @prop()
  reportCardCompletionPercentFloat: number;

  @prop()
  signedDocumentsPercent: number;

  @prop()
  signedDocumentsPercentFloat: number;
}

@pre<CompanyScore>('save', function (next) {
  this.updatedAt = new Date();
  return next();
})
export class CompanyScore {
  @prop({ ref: 'Company' })
  _company: Ref<any>;

  @prop()
  rawValues: CompanyScoreRawValues;

  @prop()
  score: number;

  @prop({ default: Date.now })
  scoreDate?: Date;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

  @prop()
  deletedAt?: Date;
}
