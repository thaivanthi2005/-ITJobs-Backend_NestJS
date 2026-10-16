import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema.js';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
  ) {}

  async list() {
    const cityList = await this.cityModel.find({});

    return {
      code: 'success',
      message: 'Cập nhật thành công!',
      cityList: cityList,
    };
  }
}
