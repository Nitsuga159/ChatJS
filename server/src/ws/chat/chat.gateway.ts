import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';

@WebSocketGateway(4040, {
  cors: true,
  namespace: 'chat',
})
export class ChatSocket {
  @WebSocketServer()
  server: Namespace;

  handleConnection(socket: Socket) {}

  @SubscribeMessage('events')
  find(client: Server): WsResponse<unknown> {
    return { event: 'activate', data: 'xdddddd' };
  }

  @SubscribeMessage('events')
  find2(client: Server): WsResponse<unknown> {
    return { event: 'activate', data: 'aaaa' };
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('aaa');
    return data;
  }
}
