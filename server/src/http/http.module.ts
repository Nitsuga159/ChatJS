import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { NotificationModule } from './notification/notification.module';
import { FriendChatModule } from './friend-chat/friend-chat.module';
import { CodeVerificationModule } from './code-verification/code-verification.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelChatModule } from './channel-chat/channel-chat.module';

@Module({
  imports: [
    UserModule,
    CodeVerificationModule,
    NotificationModule,
    FriendModule,
    ChannelModule,
    FriendChatModule,
    ChannelChatModule,
  ],
})
export class HttpModule {}
