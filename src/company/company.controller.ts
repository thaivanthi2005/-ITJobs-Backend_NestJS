import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  async registerPost(@Body() registerDto: RegisterCompanyDto) {
    return this.companyService.registerPost(registerDto);
  }
}
