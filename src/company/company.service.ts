import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  AccountCompany,
  AccountCompanyDocument,
} from './schemas/account-company.schema.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
  ) {}

  async registerPost(registerDto: RegisterCompanyDto) {
    const { companyName, email, password } = registerDto;

    const existAccount = await this.accountCompanyModel.findOne({
      email: email,
    });

    if (existAccount) {
      return {
        code: 'error',
        message: 'Email đã tồn tại',
      };
    }

    // Mã hóa mật khẩu bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newAccount = new this.accountCompanyModel({
      companyName: companyName,
      email: email,
      password: hashedPass,
    });

    await newAccount.save();

    return {
      code: 'SUCCESS',
      message: 'Đăng ký thành công',
    };
  }
}
