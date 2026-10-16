import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service.js';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('list')
  async list() {
    return this.cityService.list();
  }
}
