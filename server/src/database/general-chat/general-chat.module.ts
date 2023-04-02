import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneralChat, GeneralChatSchema } from './general-chat.model';
import { GeneralChatService } from './general-chat.service';
import { GeneralChatController } from './general-chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeneralChat.name, schema: GeneralChatSchema },
    ]),
  ],
  providers: [GeneralChatService],
  controllers: [GeneralChatController],
})
export class GeneralChatModule {}
