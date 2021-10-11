import { modelOptions, prop } from '@typegoose/typegoose';

export class OauthIdentityTokens {
  @prop()
  token_type: string;

  @prop()
  id_token: string;

  @prop()
  access_token: string;

  @prop()
  refresh_token: string;

  @prop()
  expiry_date: Date;
}

export class OauthIdentityProfile {
  @prop({ required: true })
  id: string;

  @prop()
  name: string;

  @prop()
  avatar_url: string;

  @prop()
  email: string;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: function (doc, ret, options) {
        delete ret.tokens;
        return ret;
      },
    },
  },
})
export default class OauthIdentitySchema {
  @prop({ trim: true, lowercase: true, required: true })
  kind: string;

  @prop()
  tokens: OauthIdentityTokens;

  @prop()
  profile: OauthIdentityProfile;
}
