import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PeerModule } from './peer/peer.module';
import dataValidation from './middlewares/dataValidation/dataValidation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/ResponseInterceptor';

const ConnectionMongoDB = MongooseModule.forRoot(
  process.env.DB_HOST || 'mongodb://127.0.0.1:27017/chat_js', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  imports: [ConnectionMongoDB, HttpModule, PeerModule],
})
export class AppModule {
}
