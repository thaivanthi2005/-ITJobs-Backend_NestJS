import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './user.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

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
}
