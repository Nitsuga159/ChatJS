import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChannelChatService } from './channel-chat.service';
import { ChannelChatController } from './channel-chat.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { ChannelChatModelModule } from 'src/database/channel-chat-model/channel-chat-model.module';
import { ChannelModelModule } from 'src/database/channel-model/channel-model.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import fieldsQueryMiddleware from 'src/middlewares/fieldsQuery/fieldsQuery.middleware';

@Module({
  imports: [
    ChannelChatModelModule,
    ChannelModelModule,
    UserModelModule,
    CloudinaryModule,
  ],
  controllers: [ChannelChatController],
  providers: [ChannelChatService],
})
export class ChannelChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      fieldsQueryMiddleware({ 
        allFields: ['_id', 'channelId', 'chatId', 'message', 'createdAt', 'updatedAt'], 
        fieldsToOmitDefault: ['__v'] 
      }))
      .forRoutes('/channel-chat/*',)
  }
}
