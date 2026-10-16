import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import {
  AccountCompany,
  AccountCompanyDocument,
} from './schemas/account-company.schema.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { LoginCompanyDto } from './dto/login-company.dto.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    private readonly configService: ConfigService,
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

  async loginPost(loginDto: LoginCompanyDto, res: Response) {
    const { email, password } = loginDto;

    const existAccount = await this.accountCompanyModel.findOne({
      email: email,
    });
    if (!existAccount) {
      return {
        code: 'error',
        message: 'Email không tồn tại !',
      };
    }

    const isPassValid = await bcrypt.compare(
      password,
      `${existAccount.password}`,
    );
    if (!isPassValid) {
      return {
        code: 'error',
        message: 'Mật khẩu không đúng !',
      };
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    const token = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
      },
      jwtSecret,
      {
        expiresIn: '1d', // Token thời hạn 1 ngày
      },
    );

    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
    });

    return {
      code: 'success',
      message: 'Đăng nhập thành công !',
    };
  }
}
