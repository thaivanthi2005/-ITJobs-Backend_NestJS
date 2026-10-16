import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountCompanyDocument = HydratedDocument<AccountCompany>;

@Schema({ timestamps: true, collection: 'accounts-company' })
export class AccountCompany {
  @Prop()
  companyName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  city: string;

  @Prop()
  address: string;

  @Prop()
  companyModel: string;

  @Prop()
  companyEmployees: string;

  @Prop()
  workingTime: string;

  @Prop()
  workOvertime: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop()
  phone: string;
}

export const AccountCompanySchema =
  SchemaFactory.createForClass(AccountCompany);
