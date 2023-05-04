//we need to call 'config' before that the other modules will be imported, otherwise our environment variables will not be enabled.
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 3070);
}
bootstrap();
