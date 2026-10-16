import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  AccountUser,
  AccountUserDocument,
} from './schemas/account-user.schema.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(AccountUser.name)
    private readonly accountUserModel: Model<AccountUserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async registerPost(registerDto: RegisterUserDto) {
    const { fullName, email, password } = registerDto;

    const existAccount = await this.accountUserModel.findOne({
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

    const newAccount = new this.accountUserModel({
      fullName: fullName,
      email: email,
      password: hashedPass,
    });

    await newAccount.save();

    return {
      code: 'success',
      message: 'Đăng ký thành công',
    };
  }

  async loginPost(loginDto: LoginUserDto, res: Response) {
    const { email, password } = loginDto;

    const existAccount = await this.accountUserModel.findOne({ email: email });
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
      secure: nodeEnv === 'production', // false: http, true: https
      sameSite: 'lax', // cho phép gửi cookie cho các domain
    });

    return {
      code: 'success',
      message: 'Đăng nhập thành công !',
    };
  }

  async Profile(req: any, file: Express.Multer.File | undefined, body: any) {
    if (file && (file as any).path) {
      body.avatar = (file as any).path;
    } else {
      delete body.avatar;
    }

    await this.accountUserModel.updateOne(
      {
        _id: req.account.id,
      },
      body,
    );

    return {
      code: 'success',
      message: 'Cập nhật thành công ',
    };
  }
}
