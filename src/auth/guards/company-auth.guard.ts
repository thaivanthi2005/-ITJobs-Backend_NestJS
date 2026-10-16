import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import {
  AccountCompany,
  AccountCompanyDocument,
} from '../../company/schemas/account-company.schema.js';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  constructor(
    @InjectModel(AccountCompany.name)
    private readonly accountCompanyModel: Model<AccountCompanyDocument>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const token = req.cookies?.token;

    if (!token) {
      res.json({
        code: 'error',
        message: 'Vui lòng gửi kèm theo token!',
      });
      return false;
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
      const { id, email } = decoded;

      const existAccount = await this.accountCompanyModel.findOne({
        _id: id,
        email: email,
      });

      if (!existAccount) {
        res.clearCookie('token');
        res.json({
          code: 'error',
          message: 'Token không hợp lệ!',
        });
        return false;
      }

      req.account = existAccount;
      return true;
    } catch {
      res.clearCookie('token');
      res.json({
        code: 'error',
        message: 'Token không hợp lệ!',
      });
      return false;
    }
  }
}
