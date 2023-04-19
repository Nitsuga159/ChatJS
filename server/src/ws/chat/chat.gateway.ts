import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { WsService } from 'src/ws/ws.service';
import {
  MessageToSend,
  WS_MESSAGE_TO_EVERYONE,
  WS_MESSAGE_TO_ONE,
} from './chat.type';

@WebSocketGateway(4040, {
  cors: true,
  namespace: 'chat',
})
export class ChatSocket {
  constructor(private readonly WsService: WsService) {}

  sendMessageToOne(data: MessageToSend): void {
    const { _id, ...message } = data;

    this.WsService.get(_id)?.emit(WS_MESSAGE_TO_ONE, message);
  }

  sendMessageToEveryone(data: Omit<MessageToSend, '_id'>): void {
    this.WsService.getAll().forEach((socket: Socket) => {
      socket.emit(WS_MESSAGE_TO_EVERYONE, data);
    });
  }
}
