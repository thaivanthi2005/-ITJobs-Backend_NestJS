import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountCompany,
  AccountCompanySchema,
} from './schemas/account-company.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountCompany.name, schema: AccountCompanySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class CompanyModule {}
