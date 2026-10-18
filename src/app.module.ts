import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CompanyModule } from './company/company.module.js';
import { CityModule } from './city/city.module.js';
import { SearchModule } from './search/search.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE');
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('DATA CONNECT');
            });
            connection.on('error', (error: any) => {
              console.log('DATA CONNECT ENABLE', error);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CompanyModule,
    CityModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
