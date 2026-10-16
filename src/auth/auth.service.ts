import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import {
  AccountUser,
  AccountUserDocument,
} from '../user/schemas/account-user.schema.js';
import {
  AccountCompany,
  AccountCompanyDocument,
} from '../company/schemas/account-company.schema.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AccountUser.name)
    private readonly accountUserModel: Model<AccountUserDocument>,
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    private readonly configService: ConfigService,
  ) {}

  async check(req: Request, res: Response) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return {
          code: 'error',
          message: 'Token không hợp lệ !',
        };
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
      const { id, email } = decoded;

      // USER
      const existAccountUser = await this.accountUserModel.findOne({
        _id: id,
        email: email,
      });

      if (existAccountUser) {
        const infoUser = {
          id: existAccountUser.id,
          fullName: existAccountUser.fullName,
          email: existAccountUser.email,
          avatar: existAccountUser.avatar,
          phone: existAccountUser.phone,
        };
        return {
          code: 'success',
          message: 'TOKEN HỢP LỆ',
          infoUser: infoUser,
        };
      }

      // COMPANY
      const existAccountCompany = await this.accountCompanyModel.findOne({
        _id: id,
        email: email,
      });

      if (existAccountCompany) {
        const infoCompany = {
          id: existAccountCompany.id,
          companyName: existAccountCompany.companyName,
          email: existAccountCompany.email,
          city: existAccountCompany.city,
          address: existAccountCompany.address,
          companyModel: existAccountCompany.companyModel,
          companyEmployees: existAccountCompany.companyEmployees,
          workingTime: existAccountCompany.workingTime,
          workOvertime: existAccountCompany.workOvertime,
          description: existAccountCompany.description,
          logo: existAccountCompany.logo,
          phone: existAccountCompany.phone,
        };
        return {
          code: 'success',
          message: 'TOKEN HỢP LỆ',
          infoCompany: infoCompany,
        };
      }

      if (!existAccountUser && !existAccountCompany) {
        res.clearCookie('token');
        return {
          code: 'error',
          message: 'Tài khoản không tồn tại !',
        };
      }
    } catch {
      return {
        code: 'error',
        message: 'Có lỗi xảy ra !',
      };
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    return {
      code: 'Thành CÔng',
      message: 'ĐĂNG XUẤT THÀNH CÔNG',
    };
  }
}
