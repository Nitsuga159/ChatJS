import { Module } from '@nestjs/common';
import { FriendChatService } from './friend-chat.service';
import { FriendChatController } from './friend-chat.controller';
import { WsModule } from 'src/ws/ws.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { FriendChatModelModule } from 'src/database/friend-chat-model/friend-chat-model.module';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';

@Module({
  imports: [
    FriendChatModelModule,
    FriendModelModule,
    UserModelModule,
    WsModule,
  ],
  controllers: [FriendChatController],
  providers: [FriendChatService],
})
export class FriendChatModule {}
