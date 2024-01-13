import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WS_CHANNEL, WS_CONNECTION, WS_FRIEND, WS_NOTIFICATION } from './ws.events';
import { ChannelChatDocument } from 'src/database/channel-chat-model/channel-chat-model';
import { FriendChatDocument } from 'src/database/friend-chat-model/friend-chat-model';

@WebSocketGateway(4040, {
  cors: false,
  namespace: 'chat',
})
export class Ws {
  constructor(private readonly wsService: WsService) {}

  @WebSocketServer() server: Server;

  private sockets: Map<string, Socket> = new Map()

  async handleConnection(socket: Socket) {
    try {
      Logger.debug('New client connected!');

      const tokenUser: string = socket.handshake.headers.authorization.split(' ')[1];
      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      this.sockets.set(_id, socket)
    } catch (e: any) {
      socket.disconnect(true)
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      Logger.debug('Client disconnected');

      const tokenUser: string = socket.handshake.auth.accessToken.split(' ')[1];

      const { _id }: any = verify(tokenUser, ENVS.JWT_USER_SECRET);

      this.sockets.delete(_id)
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

  @SubscribeMessage('ping')
  test(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log("pong", typeof body)

    console.log(this.server)

    this.server.emit("pong", { message: 'this is a test event' })
  }

  @SubscribeMessage(WS_CONNECTION.ROOM)
  room(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    Logger.debug(`Connect client to ${JSON.stringify(body)}`, "WebSockets - ROOM")

    client.join(body._id)
  }

  //MESSAGES

  async addChannelChatMessage(createdMessage: ChannelChatDocument) {
    Logger.debug(`Sending message to channel ${createdMessage.channelId.toString()}`, "WebSockets - CHANNEL MESSAGE")

    this.server.to(createdMessage.channelId.toString()).emit(WS_CHANNEL.NEW_CHANNEL_MESSAGE, createdMessage)
  }

  async addFriendChatMessage(user1: Types.ObjectId, user2: Types.ObjectId, createdMessage: FriendChatDocument) {
    this.sockets.get(user1.toString())?.emit(WS_FRIEND.NEW_FRIEND_MESSAGE, createdMessage)
    this.sockets.get(user2.toString())?.emit(WS_FRIEND.NEW_FRIEND_MESSAGE, createdMessage)
  }

  async deleteChannelChatMessage(ids: string[], channelId: Types.ObjectId, chatId: Types.ObjectId) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.DELETE_CHANNEL_MESSAGE, { chatId, ids })
  }

  async deleteFriendChatMessage(ids: string[], friendId: Types.ObjectId) {
    this.server.to(friendId.toString()).emit(WS_FRIEND.DELETE_FRIEND_MESSAGE, { ids })
  }

  //CHANNEL

  async updateChannel(channelId: Types.ObjectId, data: any) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.UPDATE_CHANNEL, data)
  }

  async deleteChannel(channelId: Types.ObjectId) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.DELETE_CHANNEL)
  }

  async addChannelParticipant(channelId: Types.ObjectId, userId: Types.ObjectId) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.ADD_CHANNEL_PARTICIPANT, { userId })
  }

  async deleteChannelParticipant(channelId: Types.ObjectId, userId: Types.ObjectId) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.DELETE_CHANNEL_PARTICIPANT, { userId })
  }

  async addChannelChat(channelId: Types.ObjectId, chat: { _id: Types.ObjectId, chatName: string, messagesCount: number }) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.ADD_CHANNEL_PARTICIPANT, chat)
  }

  async deleteChannelChat(channelId: Types.ObjectId, chatId: Types.ObjectId) {
    this.server.to(channelId.toString()).emit(WS_CHANNEL.DELETE_CHANNEL_PARTICIPANT, chatId)
  }

  //NOTIFICATION

  async sendNotification(userId: Types.ObjectId, invitationId: Types.ObjectId) {
    this.sockets.get(userId.toString())?.emit(WS_NOTIFICATION.SEND_NOTIFICATION, { invitationId })
  }
}
