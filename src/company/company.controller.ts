import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CompanyService } from './company.service.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { LoginCompanyDto } from './dto/login-company.dto.js';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  async registerPost(@Body() registerDto: RegisterCompanyDto) {
    return this.companyService.registerPost(registerDto);
  }

  @Post('login')
  async loginPost(
    @Body() loginDto: LoginCompanyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.companyService.loginPost(loginDto, res);
  }
}
