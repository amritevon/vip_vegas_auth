import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LogService } from './common/logging/logger.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/vipVegas'),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService],
  exports: [LogService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'protected', method: RequestMethod.ALL });
  }
}
