import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongooseExceptionFilter } from './common/exceptions/mongoose-exception.filter';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import logger from './common/logging/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.useGlobalFilters(
    new MongooseExceptionFilter(),
    new AllExceptionsFilter(),
  );
  logger.info('Application started successfully');
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
