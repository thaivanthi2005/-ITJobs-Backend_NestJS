import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../job/schemas/job.schema.js';
import {
  AccountCompany,
  AccountCompanyDocument,
} from '../company/schemas/account-company.schema.js';
import { City, CityDocument } from '../city/schemas/city.schema.js';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
  ) {}

  async search(query: any) {
    const dataFinal = [];
    if (Object.keys(query).length > 0) {
      const find: any = {};

      // language
      if (query.language) {
        find.technologies = query.language;
      }

      // City
      if (query.city) {
        const city = await this.cityModel.findOne({
          name: query.city as string,
        });

        if (city) {
          const listAccountCompanyInCity = await this.accountCompanyModel.find({
            city: city.id,
          });

          const listIdAccountCompany = listAccountCompanyInCity.map(
            (item) => item.id,
          );

          find.companyId = { $in: listIdAccountCompany };
        }
      }

      // company
      if (query.company) {
        const accountCompany = await this.accountCompanyModel.findOne({
          companyName: query.company as string,
        });

        find.companyId = accountCompany?.id;
      }

      const jobs = await this.jobModel.find(find).sort({ createdAt: 'desc' });

      for (const item of jobs) {
        const itemFinal = {
          id: item.id,
          companyLogo: '',
          title: item.title,
          companyName: '',
          salaryMin: item.salaryMin,
          salaryMax: item.salaryMax,
          position: item.position,
          workingForm: item.workingForm,
          companyCity: '',
          technologies: item.technologies,
        };

        const companyInfo = await this.accountCompanyModel.findOne({
          _id: item.companyId,
        });

        if (companyInfo) {
          itemFinal.companyLogo = `${companyInfo.logo}`;
          itemFinal.companyName = `${companyInfo.companyName}`;

          const citys = await this.cityModel.findOne({
            _id: companyInfo.city,
          });
          itemFinal.companyCity = citys?.name ? `${citys.name}` : '';
        }

        dataFinal.push(itemFinal);
      }
    }

    return {
      code: 'success',
      message: 'Thành công!',
      jobs: dataFinal,
    };
  }
}
