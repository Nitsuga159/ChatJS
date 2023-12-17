import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { ChannelChatType } from 'src/database/channel-model/channel-model.type';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { WS_CHANNEL } from 'src/ws/ws.events';
import { Ws } from 'src/ws/ws.gateway';

const ObjectId = Types.ObjectId;

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelModelService: ChannelModelService,
    private readonly userModelService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async findAll(
    userId: Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: ChannelDocument[] }> {
    return await this.channelModelService.findAll(userId, lastId);
  }

  async findById(userId: Types.ObjectId, channelId: string): Promise<any> {
    const channelDocument = await this.channelModelService.findByOtherData({
      _id: channelId,
      participants: { $in: userId },
    });

    if (!channelDocument) throw 'Channel not found';

    const chats = channelDocument.chats.map(
      ({ _id, createdAt, messagesCount, name }) => ({
        _id,
        createdAt,
        name,
        messagesCount: messagesCount.get(userId),
      }),
    );

    return { ...channelDocument.toObject(), chats };
  }

  async create(data: {
    name: string;
    admin: string | Types.ObjectId;
    description?: string;
    photo?: string;
  }): Promise<ChannelDocument> {
    data.admin = new ObjectId(data.admin.toString());

    const countUserChannels = await this.channelModelService.findByUser(
      data.admin,
    );

    if (countUserChannels.length === 5) throw 'Channel limit exceeded';

    return await this.channelModelService.create(data);
  }

  async update(channel: ChannelDocument, data: any): Promise<void> {
    const updatedChannel = await this.channelModelService.update(
      channel._id,
      data,
    );

    this.ws.emitToGroup(
      channel.participants,
      WS_CHANNEL.UPDATE_CHANNEL,
      updatedChannel,
    );
  }

  async addParticipant(
    channelId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    channelId = new ObjectId(channelId.toString());
    userId = new ObjectId(userId.toString());

    await this.channelModelService.addParticipant(channelId, userId);

    const [channel, user] = await Promise.all([
      this.channelModelService.findById(channelId),
      this.userModelService.findById(userId),
    ]);

    channel.chats.forEach((chat) =>
      chat.messagesCount.set(userId as Types.ObjectId, 0),
    );

    await channel.save();

    const filterParticipants = new Set(
      channel.participants.map((p) => p.toString()),
    );

    filterParticipants.delete(userId.toString());

    this.ws.emitToGroup(
      filterParticipants as any,
      WS_CHANNEL.ADD_CHANNEL_PARTICIPANT,
      {
        _id: user._id,
        username: user.username,
        color: user.color,
        photo: user.photo,
      },
    );
    this.ws.emitToOne(userId, WS_CHANNEL.NEW_CHANNEL, {
      _id: channel._id,
      name: channel.name,
      photo: channel.photo,
    });
  }

  async deleteParticipant(
    channelDocument: ChannelDocument,
    userId: string | Types.ObjectId,
  ) {
    userId = new ObjectId(userId.toString());

    await this.channelModelService.deleteParticipant(
      channelDocument._id,
      userId,
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.DELETE_CHANNEL_PARTICIPANT,
      userId,
    );
  }

  async addChat(
    channelDocument: ChannelDocument,
    chatName: string,
  ): Promise<void> {
    const chat = await this.channelModelService.addChat(
      channelDocument,
      chatName,
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.ADD_CHANNEL_CHAT,
      { chat: { ...chat, messagesCount: 0 }, channelId: channelDocument._id },
    );
  }

  async deleteChat(
    channelDocument: ChannelDocument,
    chatId: Types.ObjectId,
  ): Promise<void> {
    await this.channelModelService.deleteChat(channelDocument, chatId);

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.DELETE_CHANNEL_CHAT,
      { chatId, channelId: channelDocument._id },
    );
  }

  async readMessages(
    channelDocument: ChannelDocument,
    channelChat: ChannelChatType,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.channelModelService.readMessages(
      channelDocument,
      channelChat,
      userId,
    );
  }
}
