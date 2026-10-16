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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AccountUser.name)
    private readonly accountUserModel: Model<AccountUserDocument>,
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

      const existAccount = await this.accountUserModel.findOne({
        _id: id,
        email: email,
      });

      if (!existAccount) {
        res.clearCookie('token');
        return {
          code: 'error',
          message: 'Tài khoản không tồn tại !',
        };
      }

      return {
        code: 'success',
        infoUser: {
          id: existAccount.id,
          fullName: existAccount.fullName,
          email: existAccount.email,
        },
      };
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
