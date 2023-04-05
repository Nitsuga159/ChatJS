import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { GeneralChatModule } from './general-chat/general-chat.module';
import { FriendsModule } from './friends/friends.module';
import { CodeVerificationModule } from './code-verification/code-verification.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat_js'),
    UserModule,
    GeneralChatModule,
    FriendsModule,
    CodeVerificationModule,
  ],
})
export class DatabaseModule {}
