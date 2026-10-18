import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { CompanyService } from './company.service.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { LoginCompanyDto } from './dto/login-company.dto.js';
import { CompanyAuthGuard } from '../auth/guards/company-auth.guard.js';
import { storage } from '../helper/cloudinary.helper.js';

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

  @Patch('profile')
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(FileInterceptor('logo', { storage }))
  async profilePatch(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: any,
  ) {
    return this.companyService.profilePatch(req, file, body);
  }

  @Post('job/create')
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 8, { storage }))
  async jobCreate(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() body: any,
  ) {
    return this.companyService.jobCreate(req, files, body);
  }

  @Get('job/list')
  @UseGuards(CompanyAuthGuard)
  async jobList(@Req() req: Request) {
    return this.companyService.jobList(req);
  }

  @Get('job/edit/:id')
  @UseGuards(CompanyAuthGuard)
  async editJob(@Req() req: Request, @Param('id') id: string) {
    return this.companyService.editJob(req, id);
  }

  @Patch('job/edit/:id')
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 8, { storage }))
  async editJobPatch(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() body: any,
  ) {
    return this.companyService.editJobPatch(req, id, files, body);
  }

  @Delete('job/delete/:id')
  @UseGuards(CompanyAuthGuard)
  async deleteJobDel(@Req() req: Request, @Param('id') id: string) {
    return this.companyService.deleteJobDel(req, id);
  }
}
