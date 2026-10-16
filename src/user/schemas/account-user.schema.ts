import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountUserDocument = HydratedDocument<AccountUser>;

@Schema({ timestamps: true, collection: 'accounts-user' })
export class AccountUser {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  phone: string;
}

export const AccountUserSchema = SchemaFactory.createForClass(AccountUser);
