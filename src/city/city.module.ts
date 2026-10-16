import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './schemas/city.schema.js';
import { CityController } from './city.controller.js';
import { CityService } from './city.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [MongooseModule, CityService],
})
export class CityModule {}
