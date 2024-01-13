import { Module } from '@nestjs/common';
import { ChannelChatService } from './channel-chat.service';
import { ChannelChatController } from './channel-chat.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { ChannelChatModelModule } from 'src/database/channel-chat-model/channel-chat-model.module';
import { ChannelModelModule } from 'src/database/channel-model/channel-model.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [
    ChannelChatModelModule,
    ChannelModelModule,
    UserModelModule,
    CloudinaryModule,
    WsModule
  ],
  controllers: [ChannelChatController],
  providers: [ChannelChatService],
})
export class ChannelChatModule {}
