import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LogService } from './common/logging/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameConfigsModule } from './game-configs/game-configs.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb://localhost:27017/vipVegas',
      }),
    }),
    UsersModule,
    GameConfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService],
  exports: [LogService],
})
export class AppModule {}
