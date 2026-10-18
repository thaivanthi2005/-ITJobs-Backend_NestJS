import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller.js';
import { SearchService } from './search.service.js';
import { Job, JobSchema } from '../job/schemas/job.schema.js';
import {
  AccountCompany,
  AccountCompanySchema,
} from '../company/schemas/account-company.schema.js';
import { City, CitySchema } from '../city/schemas/city.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: AccountCompany.name, schema: AccountCompanySchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
