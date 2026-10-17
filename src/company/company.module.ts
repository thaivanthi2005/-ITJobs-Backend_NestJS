import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountCompany,
  AccountCompanySchema,
} from './schemas/account-company.schema.js';
import { Job, JobSchema } from '../job/schemas/job.schema.js';
import { City, CitySchema } from '../city/schemas/city.schema.js';
import { CompanyController } from './company.controller.js';
import { CompanyService } from './company.service.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountCompany.name, schema: AccountCompanySchema },
      { name: Job.name, schema: JobSchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyAuthGuard],
  exports: [MongooseModule, CompanyService, CompanyAuthGuard],
})
export class CompanyModule {}
