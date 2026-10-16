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
  AccountUser,
  AccountUserDocument,
} from '../../user/schemas/account-user.schema.js';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    @InjectModel(AccountUser.name)
    private readonly accountUserModel: Model<AccountUserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const token = req.cookies?.token;

    if (!token) {
      res.json({
        code: 'error',
        message: 'Vui lòng gửi kèm TOKEN !',
      });
      return false;
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
      const { id, email } = decoded;

      const existAccountUser = await this.accountUserModel.findOne({
        _id: id,
        email: email,
      });

      if (!existAccountUser) {
        res.json({
          code: 'error',
          message: ' TOKEN Không hợp lệ !',
        });
        return false;
      }

      req.account = existAccountUser;
      return true;
    } catch {
      res.clearCookie('token');
      res.json({
        code: 'error',
        message: ' TOKEN Không hợp lệ !',
      });
      return false;
    }
  }
}
