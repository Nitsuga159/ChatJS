import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsService } from './ws.service';

@WebSocketGateway(4040, {
  cors: true,
  namespace: 'chat',
})
export class Ws {
  constructor(private readonly wsService: WsService) {}

  handleConnection(socket: Socket) {
    const id: string = socket.handshake.query.id as string;

    this.wsService.set(id, socket);
  }

  handleDisconnect(socket: Socket) {
    const id: string = socket.handshake.query.id as string;

    this.wsService.delete(id);
  }
}
