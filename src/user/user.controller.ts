import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { UserService } from './user.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserAuthGuard } from '../auth/guards/user-auth.guard.js';
import { storage } from '../helper/cloudinary.helper.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerPost(@Body() registerDto: RegisterUserDto) {
    return this.userService.registerPost(registerDto);
  }

  @Post('login')
  async loginPost(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.loginPost(loginDto, res);
  }

  @Patch('profile')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async Profile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: any,
  ) {
    return this.userService.Profile(req, file, body);
  }
}
