import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { AddChatRequest, ChannelChatType } from 'src/database/channel-model/channel-model.type';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { WS_CHANNEL } from 'src/ws/ws.events';
import { Ws } from 'src/ws/ws.gateway';
import { ChannelChatService } from '../channel-chat/channel-chat.service';
import { ChannelChatModelService } from 'src/database/channel-chat-model/channel-chat-model.service';

const { ObjectId } = Types;

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelModelService: ChannelModelService,
    private readonly channelChatModelService: ChannelChatModelService,
    private readonly userModelService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async findAll(
    userId: string,
    lastId: string,
    fields: {} = {}
  ) {
    return await this.channelModelService.findAll(new ObjectId(userId), lastId, fields);
  }

  async findAllByAdmin(
    adminId: string,
    fields: {} = {}
  ) {
    return await this.channelModelService.findAllByAdmin(new ObjectId(adminId), fields);
  }

  async findById(userId: string, channelId: string, fields: {} = {}): Promise<any> {
    const channelDocument = await this.channelModelService.findByOtherData({
      _id: channelId,
      participants: { $in: userId },
    }, fields);

    if (!channelDocument) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_GATEWAY, message: 'Channel not found' })
    }

    return this.channelModelService.mapChannel(new ObjectId(userId), channelDocument)
  }

  async create(data: {
    name: string;
    admin: Types.ObjectId;
    description?: string;
    photo?: string;
  }): Promise<ChannelDocument> {
    data.admin = new ObjectId(data.admin.toString());

    const countUserChannels = await this.channelModelService.countUserChannel(
      data.admin,
    );

    if (countUserChannels === 5) {
      throw new DefaultHttpException({ status: HttpStatus.FORBIDDEN, message: 'Channel limit exceeded' })
    }

    return await this.channelModelService.create(data);
  }

  async updateChat(channelId: string, adminId: string, chatId: string, data: any) {
    await this.channelModelService.updateChat(
      new ObjectId(channelId),
      new ObjectId(adminId),
      new ObjectId(chatId),
      data
    )
  }

  async update(channelId: string, admindId: string, data: any): Promise<void> {
    const updatedChannel = await this.channelModelService.update(
      new ObjectId(channelId),
      new ObjectId(admindId),
      data,
    );

    if(!updatedChannel) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Channel not found' })
    }

    this.ws.emitToGroup(
      updatedChannel.participants,
      WS_CHANNEL.UPDATE_CHANNEL,
      updatedChannel,
    );
  }

  async addParticipant(
    channelId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    fields: {} = {}
  ): Promise<void> {
    channelId = new ObjectId(channelId.toString());
    userId = new ObjectId(userId.toString());

    await this.channelModelService.addParticipant(channelId, userId);

    const [channel, user] = await Promise.all([
      this.channelModelService.findById(channelId, fields),
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

    return channel.toObject()
  }

  async deleteParticipant(
    channelId: string,
    adminId: string,
    participantId: string
  ) {
    const channelDocument = await this.channelModelService.findByOtherData({ 
      _id: new ObjectId(channelId), 
      admin: new ObjectId(adminId),
      participants: { $in: new ObjectId(participantId) }
    })

    await this.channelModelService.deleteParticipant(
      new ObjectId(channelId),
      new ObjectId(adminId),
      new ObjectId(participantId)
    );

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.DELETE_CHANNEL_PARTICIPANT,
      participantId,
    );
  }

  async addChat(data: AddChatRequest ) {
    const { channelDocument, chat } = await this.channelModelService.addChat(data);

    this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.ADD_CHANNEL_CHAT,
      { chat: { ...channelDocument, messagesCount: 0 }, channelId: data.channelId },
    );

    return chat
  }

  async deleteChat(
    channelId: string,
    adminId: string,
    chatId: string,
  ) {
    //delete chat from channel
    await this.channelModelService.deleteChat(
      new ObjectId(channelId), 
      new ObjectId(adminId),
      new ObjectId(chatId)
    );

    //delete messages from chat
    await this.channelChatModelService.deleteByChat(new ObjectId(channelId), new ObjectId(chatId))

    /*this.ws.emitToGroup(
      channelDocument.participants,
      WS_CHANNEL.DELETE_CHANNEL_CHAT,
      { chatId, channelId: channelDocument._id },
    );*/

    return { chatId }
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

  async delete(channelId: Types.ObjectId, adminId: Types.ObjectId) {
    await this.channelModelService.delete(channelId, adminId)

    await this.channelChatModelService.deleteByChannel(channelId)

    return { success: true }
  }
}
