import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PeerModule } from './peer/peer.module';
import dataValidation from './middlewares/dataValidation/dataValidation';

const ConnectionMongoDB = MongooseModule.forRoot(
  process.env.DB_HOST || 'mongodb://127.0.0.1:27017/chat_js', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

@Module({
  imports: [ConnectionMongoDB, HttpModule, PeerModule],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
    .apply(
      dataValidation({ headers: [{ key: 'x-transaction-id', value: /\d+transaction\d+/, message: 'Transaction id must have another value', }]})
    ).forRoutes('*')
    .apply(
      dataValidation({ query: [{ key: 'tokenMail', message: 'must not be null' }] })
    ).forRoutes('/user/register');

    
  }
}
