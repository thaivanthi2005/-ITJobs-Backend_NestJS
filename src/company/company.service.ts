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
import { Job, JobDocument } from '../job/schemas/job.schema.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { LoginCompanyDto } from './dto/login-company.dto.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    @InjectModel(Job.name)
    private readonly jobCompanyModel: Model<JobDocument>,
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

  async profilePatch(
    req: any,
    file: Express.Multer.File | undefined,
    body: any,
  ) {
    if (file && (file as any).path) {
      body.logo = (file as any).path;
    } else {
      delete body.logo;
    }

    await this.accountCompanyModel.updateOne(
      {
        _id: req.account.id,
      },
      body,
    );

    return {
      code: 'success',
      message: 'Cập nhật thành công!',
    };
  }

  async jobCreate(
    req: any,
    files: Express.Multer.File[] | undefined,
    body: any,
  ) {
    body.companyId = req.account.id;
    body.salaryMin = body.salaryMin ? parseInt(body.salaryMin) : 0;
    body.salaryMax = body.salaryMax ? parseInt(body.salaryMax) : 0;
    body.technologies = body.technologies
      ? typeof body.technologies === 'string'
        ? body.technologies.split(', ')
        : body.technologies
      : [];
    body.images = [];

    // Xử lý mảng images
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if ((file as any).path) {
          body.images.push((file as any).path);
        }
      }
    }

    const newRecord = new this.jobCompanyModel(body);
    await newRecord.save();

    return {
      code: 'success',
      message: 'Tạo công việc thành công!',
    };
  }
}
