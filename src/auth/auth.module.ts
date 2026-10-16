import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import {
  AccountUser,
  AccountUserSchema,
} from '../user/schemas/account-user.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountUser.name, schema: AccountUserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
