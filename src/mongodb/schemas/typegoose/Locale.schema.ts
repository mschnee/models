import { pre, prop } from '@typegoose/typegoose';

@pre<Locale>('save', function (next) {
  this.updated_at = new Date();
  return next();
})
export class Locale {
  @prop({ index: true })
  stateId: string;

  @prop({ index: true })
  stateName: string;

  @prop()
  city: string;

  @prop({ index: true })
  zip: number;

  @prop()
  timeZone: string;

  @prop()
  lat: string;

  @prop()
  lng: string;

  @prop({ default: Date.now })
  created_at: Date;

  @prop()
  updated_at?: Date;
}
