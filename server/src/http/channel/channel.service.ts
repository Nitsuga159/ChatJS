import { Injectable } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { Ws } from 'src/ws/ws.gateway';
import WS_EVENTS from 'src/ws/ws.type';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelModelService: ChannelModelService,
    private readonly userModelService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async findAll(userId: Types.ObjectId): Promise<ChannelDocument[]> {
    return await this.channelModelService.findAll(userId);
  }

  async create(data: {
    name: string;
    admin: Types.ObjectId;
    description?: string;
    photo?: string;
  }): Promise<ChannelDocument> {
    const countUserChannels = await this.channelModelService.count(data.admin);

    if (countUserChannels === 5) throw 'Channel limit exceeded';

    return await this.channelModelService.create(data);
  }

  async update(channel: ChannelDocument, data: any): Promise<void> {
    const updatedChannel = await this.channelModelService.update(
      channel._id,
      data,
    );

    this.ws.emitToGroup(
      channel.participants,
      WS_EVENTS.UPDATE_CHANNEL,
      updatedChannel,
    );
  }

  async addParticipant(
    channelId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.channelModelService.addParticipant(channelId, userId);

    const [channel, user] = await Promise.all([
      this.channelModelService.findById(channelId),
      this.userModelService.findById(userId),
    ]);

    this.ws.emitToGroup(channel.participants, WS_EVENTS.ADD_PARTICIPANT, user);
    this.ws.emitToOne(userId, WS_EVENTS.NEW_CHANNEL, channel);
  }

  async deleteParticipant(channelDocument: ChannelDocument, userId: string) {
    await this.channelModelService.deleteParticipant(
      channelDocument._id,
      new Types.ObjectId(userId),
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_EVENTS.DELETE_PARTICIPANT,
      userId,
    );
  }

  async addChat(
    channelDocument: ChannelDocument,
    chatName: string,
  ): Promise<void> {
    const chatId = await this.channelModelService.addChat(
      channelDocument,
      chatName,
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_EVENTS.ADD_CHAT_CHANNEL,
      { chatName, chatId },
    );
  }

  async deleteChat(
    channelDocument: ChannelDocument,
    chatName: string,
  ): Promise<void> {
    const chatId = await this.channelModelService.deleteChat(
      channelDocument,
      chatName,
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_EVENTS.DELETE_CHAT_CHANNEL,
      { chatName, chatId },
    );
  }
}
