import * as _ from 'lodash';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import * as Types from '../../../types';
import { Documents } from '../../types';
import OauthIdentitySchema, { OauthIdentityProfile, OauthIdentityTokens } from './sub/OauthIdentity';

@modelOptions({
  schemaOptions: {
    minimize: false,
    toJSON: {
      transform(doc, ret) {
        return _.pick(ret, [
          '_id',
          'username',
          'email',
          'active',
          'TOSAccepted',
          'activation_status',
          'created_at',
          'oauth_identities',
        ]);
      },
    },
    toObject: {
      transform(doc, ret) {
        return _.pick(ret, [
          '_id',
          'username',
          'email',
          'active',
          'TOSAccepted',
          'activation_status',
          'created_at',
          'oauth_identities',
        ]);
      },
    },
  },
})
export class Auth {
  @prop({ ref: 'User', default: null, index: true })
  _user?: Ref<any>;

  @prop({ trim: true, required: true, unique: true, lowercase: true })
  username: string;

  @prop({ trim: true, index: true, lowercase: true })
  email: string;

  @prop({ trim: true, select: false })
  password?: string;

  @prop({ type: OauthIdentitySchema })
  oauth_identities?: OauthIdentitySchema[];

  @prop({
    default: false,
    set: function (val: boolean) {
      if (!this.tosAcceptedAt && this.TOSAccepted === false && val === true) {
        this.tosAcceptedAt = new Date();
      }
      return val;
    },
    get: (value) => value,
  })
  TOSAccepted?: boolean;

  @prop({ default: null })
  tosAcceptedAt?: Date;

  @prop({ default: true, required: true })
  active?: boolean;

  @prop({ enum: Object.values(Types.Auth.ActivationStatus) })
  activation_status?: Types.Auth.ActivationStatus;

  @prop({ default: null })
  leadToken?: string;

  @prop({ default: null })
  password_reset_token?: string;

  @prop({ default: () => new Date() })
  created_at?: Date;

  @prop({ default: '' })
  pandaContactId?: string;

  setEmail(this: Documents.Auth, email: string): void {
    this.email = email;
    this.username = email;
  }

  setPassword(this: Documents.Auth, hashedPassword: string): void {
    if (this.activation_status != 'activated') {
      this.activation_status = Types.Auth.ActivationStatus.Activated;
    }
    this.password = hashedPassword;
  }

  addOauthToken(this: Documents.Auth, kind: string, tokens: OauthIdentityTokens, profile: OauthIdentityProfile): void {
    this.oauth_identities.push({
      kind,
      tokens,
      profile,
    });
  }

  updateOauthToken(this: Documents.Auth, kind: string, tokens: OauthIdentityTokens): void {
    const iden = this.oauth_identities.find((i) => i.kind == kind);

    iden.tokens = {
      ...iden.tokens,
      ...tokens,
    };

    this.markModified('oauth_identities');
  }

  findOauthByKind(kind: string): OauthIdentitySchema {
    return this.oauth_identities.find((i) => i.kind == kind);
  }

  removeOauthTokenById(id: string | ObjectId): void {
    (this.oauth_identities as mongoose.Types.Array<OauthIdentitySchema>).pull(id);
  }
}
