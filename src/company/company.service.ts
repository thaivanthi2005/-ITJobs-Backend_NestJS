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
import { City, CityDocument } from '../city/schemas/city.schema.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { LoginCompanyDto } from './dto/login-company.dto.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    @InjectModel(Job.name)
    private readonly jobCompanyModel: Model<JobDocument>,
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
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

  async jobList(req: any) {
    const find = {
      companyId: req.account.id,
    };
    const limitItems = 3;
    let page = 1;
    if (req.query?.page) {
      const currentPage = parseInt(`${req.query.page}`);
      if (currentPage > 0) {
        page = currentPage;
      }
    }
    const totalRecord = await this.jobCompanyModel.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    if (page > totalPage && totalPage !== 0) {
      page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    const jobs = await this.jobCompanyModel
      .find(find)
      .sort({
        createdAt: 'desc',
      })
      .limit(limitItems)
      .skip(skip);

    const dataFinal = [];

    const city = await this.cityModel.findOne({
      _id: req.account.city,
    });

    for (const item of jobs) {
      dataFinal.push({
        id: item.id,
        companyLogo: req.account.logo,
        title: item.title,
        companyName: req.account.companyName,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        companyCity: city?.name,
        technologies: item.technologies,
      });
    }

    return {
      code: 'success',
      message: 'Lấy danh sách công việc thành công!',
      jobs: dataFinal,
      totalPage: totalPage,
    };
  }

  async editJob(req: any, id: string) {
    try {
      const jobDetail = await this.jobCompanyModel.findOne({
        _id: id,
        companyId: req.account.id,
      });

      if (!jobDetail) {
        return {
          code: 'error',
          message: 'Id không hợp lệ!',
        };
      }

      return {
        code: 'success',
        message: 'Thành công!',
        jobDetail: jobDetail,
      };
    } catch {
      return {
        code: 'error',
        message: 'Id không hợp lệ!',
      };
    }
  }

  async editJobPatch(
    req: any,
    id: string,
    files: Express.Multer.File[] | undefined,
    body: any,
  ) {
    try {
      const jobDetail = await this.jobCompanyModel.findOne({
        _id: id,
        companyId: req.account.id,
      });

      if (!jobDetail) {
        return {
          code: 'error',
          message: 'Id không hợp lệ!',
        };
      }

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

      await this.jobCompanyModel.updateOne(
        {
          _id: id,
          companyId: req.account.id,
        },
        body,
      );

      return {
        code: 'success',
        message: 'Cập nhật thành công!',
      };
    } catch {
      return {
        code: 'error',
        message: 'Id không hợp lệ!',
      };
    }
  }
}
