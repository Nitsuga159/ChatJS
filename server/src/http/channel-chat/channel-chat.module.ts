import { Module } from '@nestjs/common';
import { ChannelChatService } from './channel-chat.service';
import { ChannelChatController } from './channel-chat.controller';
import { WsModule } from 'src/ws/ws.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { ChannelChatModelModule } from 'src/database/channel-chat-model/channel-chat-model.module';
import { ChannelModelModule } from 'src/database/channel-model/channel-model.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    ChannelChatModelModule,
    ChannelModelModule,
    UserModelModule,
    WsModule,
    CloudinaryModule,
  ],
  controllers: [ChannelChatController],
  providers: [ChannelChatService],
})
export class ChannelChatModule {}
