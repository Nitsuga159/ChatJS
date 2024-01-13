//we need to call 'config' before that the other modules will be imported, otherwise our environment variables will not be enabled.
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => Object.values(error.constraints)).flat();
        return new BadRequestException({ status: 400, messages });
      }
    }),
  );

  await app.listen(process.env.PORT || 3070);
}
bootstrap();
