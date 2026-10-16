import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import {
  AccountUser,
  AccountUserSchema,
} from './schemas/account-user.schema.js';
import { UserAuthGuard } from '../auth/guards/user-auth.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountUser.name, schema: AccountUserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthGuard],
  exports: [UserService, UserAuthGuard],
})
export class UserModule {}
