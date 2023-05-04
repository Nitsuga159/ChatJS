import { Module } from '@nestjs/common';
import { ChannelChat, ChannelChatSchema } from './channel-chat-model';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelChatModelService } from './channel-chat-model.service';

const ChannelChatModel = MongooseModule.forFeature([
  { name: ChannelChat.name, schema: ChannelChatSchema },
]);

@Module({
  imports: [ChannelChatModel],
  providers: [ChannelChatModelService],
  exports: [ChannelChatModel, ChannelChatModelService],
})
export class ChannelChatModelModule {}
