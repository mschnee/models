import { modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { PolicySourceType } from '../../../types/policies';

@modelOptions({ options: { allowMixed: 0 } })
class DocumentTemplateVersions {
  @prop({ required: true })
  version: number;

  @prop({ type: Schema.Types.Mixed })
  delta: any[];
}

@modelOptions({ options: { allowMixed: 0 } })
@pre<DocumentTemplate>('save', function () {
  this.updated_at = new Date();
})
export class DocumentTemplate {
  @prop({ ref: 'Company' })
  _company?: Ref<any>;

  @prop({ enum: Object.values(PolicySourceType), required: true, default: PolicySourceType.Bambee })
  type: PolicySourceType;

  @prop({ required: true, trim: true })
  name: string;

  @prop({ default: null, trim: true })
  displayName?: string;

  @prop({ type: Schema.Types.Mixed })
  delta?: any[];

  @prop()
  html?: string;

  @prop({ trim: true })
  notes?: string;

  @prop({ enum: [null, 'quill', 'ckeditor'], default: null })
  editor?: string;

  @prop({ default: null })
  icon?: string;

  @prop({ default: null, trim: true })
  description?: string;

  @prop({ type: Number, default: 1 })
  version?: number;

  @prop({ type: DocumentTemplateVersions })
  versions?: DocumentTemplateVersions[];

  @prop({ default: false })
  isContractor?: boolean;

  @prop({ default: true })
  active?: boolean;

  @prop({ default: () => new Date() })
  created_at?: Date;

  @prop()
  updated_at?: Date;

  @prop()
  pandaTemplateId?: string;
}
