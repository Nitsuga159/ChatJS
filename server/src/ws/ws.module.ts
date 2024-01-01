import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { Ws } from './ws.gateway';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import { ChannelChatModelModule } from 'src/database/channel-chat-model/channel-chat-model.module';

@Module({
  imports: [FriendModelModule, ChannelChatModelModule],
  providers: [WsService, Ws],
  exports: [Ws],
})
export class WsModule {}
