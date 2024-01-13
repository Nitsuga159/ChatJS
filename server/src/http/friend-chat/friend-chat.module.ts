import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendChatService } from './friend-chat.service';
import { FriendChatController } from './friend-chat.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { FriendChatModelModule } from 'src/database/friend-chat-model/friend-chat-model.module';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [
    WsModule,
    FriendChatModelModule,
    FriendModelModule,
    UserModelModule,
    CloudinaryModule,
  ],
  controllers: [FriendChatController],
  providers: [FriendChatService],
})
export class FriendChatModule {
}
