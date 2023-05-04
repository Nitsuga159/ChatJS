import { Module } from '@nestjs/common';
import { FriendChat, FriendChatSchema } from './friend-chat-model';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendChatModelService } from './friend-chat-model.service';

const FriendChatModel = MongooseModule.forFeature([
  { name: FriendChat.name, schema: FriendChatSchema },
]);

@Module({
  imports: [FriendChatModel],
  providers: [FriendChatModelService],
  exports: [FriendChatModel, FriendChatModelService],
})
export class FriendChatModelModule {}
