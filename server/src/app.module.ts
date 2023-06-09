import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_HOST || 'mongodb://localhost:27017/chat_js',
    ),
    HttpModule,
  ],
})
export class AppModule {}
