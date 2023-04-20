import { Module } from '@nestjs/common';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserChat, UserChatSchema } from './user-chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserChat.name, schema: UserChatSchema },
    ]),
  ],
  controllers: [UserChatController],
  providers: [UserChatService],
})
export class UserChatModule {}
