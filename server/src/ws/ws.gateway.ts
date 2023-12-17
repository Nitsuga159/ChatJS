import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsService } from './ws.service';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { PER_EXTEND_PAGE_FRIEND } from 'src/database/friend-model/friend-model.type';
import { WS_CHANNEL, WS_FRIEND, WS_USER } from './ws.events';

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
      console.log('New client connected!');

      const tokenUser: string = socket.handshake.auth.accessToken.split(' ')[1];
      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      this.wsService.set(_id, socket);

      this.connectionEvent(_id, WS_USER.USER_CONNECTION);
    } catch (e: any) {
      return new HttpException(
        `Error to connect: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      console.log('Client disconnected');
      const tokenUser: string = socket.handshake.auth.accessToken.split(' ')[1];

      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      const deletedSocket: Socket = this.wsService.delete(_id);
      console.log(deletedSocket);
      if (!deletedSocket) return;

      this.connectionEvent(_id, WS_USER.USER_DISCONNECTION);
    } catch (e: any) {
      return new HttpException(
        `Error to disconnect: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  isConnected(id: Types.ObjectId): boolean {
    return this.wsService.has(id);
  }

  emitToOne(
    id: Types.ObjectId,
    event: WS_CHANNEL | WS_FRIEND | WS_USER,
    data: any,
  ): void {
    this.wsService.get(id)?.emit(event, data);
  }

  emitToGroup(
    ids: Types.ObjectId[],
    event: WS_CHANNEL | WS_FRIEND | WS_USER,
    data: any,
  ): void {
    ids.forEach((id: Types.ObjectId) => {
      this.wsService.get(id)?.emit(event, data);
    });
  }

  async connectionEvent(
    userId: Types.ObjectId,
    type: WS_USER.USER_CONNECTION | WS_USER.USER_DISCONNECTION,
  ): Promise<void> {
    let page = 0;
    while (true) {
      const friendsIds: Types.ObjectId[] =
        await this.friendModelService.extendsFind(
          new Types.ObjectId(userId),
          page,
        );

      if (friendsIds.length < PER_EXTEND_PAGE_FRIEND) break;

      this.emitToGroup(friendsIds, WS_USER[type], { userId });

      page++;
    }
  }
}
