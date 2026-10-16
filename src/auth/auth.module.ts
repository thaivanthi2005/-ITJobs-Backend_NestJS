import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import {
  AccountUser,
  AccountUserSchema,
} from '../user/schemas/account-user.schema.js';
import {
  AccountCompany,
  AccountCompanySchema,
} from '../company/schemas/account-company.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountUser.name, schema: AccountUserSchema },
      { name: AccountCompany.name, schema: AccountCompanySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
