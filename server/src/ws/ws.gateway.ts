import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsService } from './ws.service';
import WS_EVENTS from './ws.type';
import { Types } from 'mongoose';

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

  emitToOne(id: string | Types.ObjectId, event: WS_EVENTS, data: any) {
    this.wsService.get(id)?.emit(event, data);
  }

  emitToGroup(ids: string[] | Types.ObjectId[], event: WS_EVENTS, data: any) {
    ids.forEach((id: string | Types.ObjectId) => {
      this.wsService.get(id)?.emit(event, data);
    });
  }
}
