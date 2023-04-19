import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WsModule } from 'src/ws/ws.module';
import { Chat, ChatSchema } from './chat.model';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatSocket } from '../../ws/chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    WsModule,
  ],
  providers: [ChatService, ChatSocket],
  controllers: [ChatController],
})
export class ChatModule {}
