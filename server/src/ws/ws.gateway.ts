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
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { PER_EXTEND_PAGE_FRIEND } from 'src/database/friend-model/friend-model.type';

@WebSocketGateway(4040, {
  cors: true,
  namespace: 'chat',
})
export class Ws {
  constructor(
    private readonly friendModelService: FriendModelService,
    private readonly wsService: WsService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const tokenUser: string = socket.handshake.auth.accessToken.split(' ')[1];

      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      this.wsService.set(_id, socket);

      this.connectionEvent(_id, WS_EVENTS.USER_CONNECTION);
    } catch (e: any) {
      return new HttpException(
        `Error to connect: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const tokenUser: string = socket.handshake.auth.accessToken.split(' ')[1];

      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      const deletedSocket: Socket = this.wsService.delete(_id, socket.id);

      if (!deletedSocket) return;

      this.connectionEvent(_id, WS_EVENTS.USER_DICONNECTION);
    } catch (e: any) {
      return new HttpException(
        `Error to disconnect: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  emitToOne(id: Types.ObjectId, event: WS_EVENTS, data: any): void {
    this.wsService.get(id)?.forEach((socket) => socket.emit(event, data));
  }

  emitToGroup(ids: Types.ObjectId[], event: WS_EVENTS, data: any): void {
    ids.forEach((id: Types.ObjectId) => {
      this.wsService.get(id)?.forEach((socket) => socket.emit(event, data));
    });
  }

  async connectionEvent(
    userId: Types.ObjectId,
    type: WS_EVENTS.USER_CONNECTION | WS_EVENTS.USER_DICONNECTION,
  ): Promise<void> {
    let page = 0;
    while (true) {
      const friendsIds: Types.ObjectId[] =
        await this.friendModelService.extendsFind(
          new Types.ObjectId(userId),
          page,
        );

      if (friendsIds.length < PER_EXTEND_PAGE_FRIEND) break;

      this.emitToGroup(friendsIds, WS_EVENTS[type], { userId });

      page++;
    }
  }
}
