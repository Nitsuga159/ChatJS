import fs from 'fs'
import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { AddChatRequest, ChannelChatType } from 'src/database/channel-model/channel-model.type';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { Ws } from 'src/ws/ws.gateway';
import { ChannelChatModelService } from 'src/database/channel-chat-model/channel-chat-model.service';
import { QueryFilterProps } from 'src/utils/queryFilter';
import { ChannelQuery } from './channel.body';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Readable } from 'stream';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelModelService: ChannelModelService,
    private readonly channelChatModelService: ChannelChatModelService,
    private readonly userModelService: UserModelService,
    private readonly wsGateway: Ws,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async findAll(
    userId: Types.ObjectId,
    queryProps: ChannelQuery
  ) {
    return await this.channelModelService.findAll(userId, queryProps);
  }

  async findAllByAdmin(
    adminId: Types.ObjectId,
    fields: {} = {}
  ) {
    return await this.channelModelService.findAllByAdmin(adminId, fields);
  }

  async findById(userId: Types.ObjectId, channelId: Types.ObjectId, fields: {} = {}): Promise<any> {
    const channelDocument = await this.channelModelService.findByOtherData({
      _id: channelId,
      participants: { $in: userId },
    }, fields);

    if (!channelDocument) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_GATEWAY, message: 'Channel not found' })
    }

    return this.channelModelService.mapChannel(userId, channelDocument)
  }

  async create(data: {
    name: string;
    admin: Types.ObjectId;
    description?: string;
    photo?: Express.Multer.File;
  }): Promise<ChannelDocument> {
    const countUserChannels = await this.channelModelService.countUserChannel(
      data.admin,
    );

    let photo: string | undefined;

    if(data.photo) {
      photo = await this.cloudinaryService.uploadImage(Readable.from(data.photo.buffer))
    }

    if (countUserChannels === 5) {
      throw new DefaultHttpException({ status: HttpStatus.FORBIDDEN, message: 'Channel limit exceeded' })
    }

    return await this.channelModelService.create({ ...data, photo });
  }

  async updateChat(channelId: Types.ObjectId, adminId: Types.ObjectId, chatId: Types.ObjectId, data: any) {
    await this.channelModelService.updateChat(
      channelId,
      adminId,
      chatId,
      data
    )
  }

  async update(channelId: Types.ObjectId, admindId: Types.ObjectId, data: any): Promise<void> {
    const updatedChannel = await this.channelModelService.update(
      channelId,
      admindId,
      data,
    );

    if(!updatedChannel) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Channel not found' })
    }

    this.wsGateway.updateChannel(channelId, data)
  }

  async addParticipant(
    channelId: Types.ObjectId,
    userId: Types.ObjectId,
    fields: {} = {}
  ): Promise<void> {
    await this.channelModelService.addParticipant(channelId, userId);

    const [channel] = await Promise.all([
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

    this.wsGateway.addChannelParticipant(channelId, userId)

    return channel.toObject()
  }

  async deleteParticipant(
    channelId: Types.ObjectId,
    adminId: Types.ObjectId,
    participantId: Types.ObjectId
  ) {
    const isValid = await this.channelModelService.exists({ 
      _id: channelId, 
      admin: adminId,
      participants: { $in: participantId }
    })

    if(!isValid) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Data doesn\'t match' })
    }

    await this.channelModelService.deleteParticipant(
      channelId,
      adminId,
      participantId
    );

    this.wsGateway.deleteChannelParticipant(channelId, participantId)
  }

  async addChat(data: AddChatRequest ) {
    const { chat } = await this.channelModelService.addChat(data);

    this.wsGateway.addChannelChat(data.channelId, chat as any)

    return chat
  }

  async deleteChat(
    channelId: Types.ObjectId,
    adminId: Types.ObjectId,
    chatId: Types.ObjectId,
  ) {
    //delete chat from channel
    await this.channelModelService.deleteChat(
      channelId, 
      adminId,
      chatId
    );

    //delete messages from chat
    await this.channelChatModelService.deleteByChat(channelId, chatId)

    this.wsGateway.deleteChannelChat(channelId, chatId)

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
