import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.model';
import { Model, Types } from 'mongoose';
import { AddChatRequest, ChannelChatType } from './channel-model.type';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';

@Injectable()
export class ChannelModelService {
  private static readonly PER_PAGE_CHANNELS: number = 5;

  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>,
  ) {}

  /**
   * Search a document which has that channelId and is admin with adminId
   * @param data - { adminId, channelId }
   * @returns null or coincidence
   */
  async isAdmin({ adminId, channelId }: { adminId: Types.ObjectId, channelId: Types.ObjectId }) {
    return await this.channelModel.exists({ _id: channelId, admin: adminId })
  }

  /**
   * Search a document which is member with that channelId
   * @param data - { userId, channelId }
   * @returns null or coincidence
   */
  async isMember({ userId, channelId }: { userId: Types.ObjectId, channelId: Types.ObjectId }) {
    return await this.channelModel.exists({ _id: channelId, participants: { $in: userId } })
  }

  /**
   * Search a document which is member with that channelId and a chat with that chatId
   * @param data - { userId, channelId, chatId }
   * @returns null or coincidence
   */
  async isMemberAndHasChat({ userId, channelId, chatId }: { userId: Types.ObjectId, channelId: Types.ObjectId, chatId: Types.ObjectId }) {
    return await this.channelModel.exists({ 
      _id: channelId, 
      participants: { $in: userId }, 
      chats: { $elemMatch: { _id: chatId } } 
    })
  }

  /**
   * Search a document which userId is not member and check if adminId & channelId match
   * @param data - { userId, channelId, adminId }
   * @returns null or coincidence
   */
  async isNotMemberAndCheckAdmin({ userId, channelId, adminId }: { userId: Types.ObjectId, channelId: Types.ObjectId, adminId: Types.ObjectId }) {
    return await this.channelModel.exists({ 
      _id: channelId, 
      admin: adminId,
      participants: { $in: userId }
    })
  }

  async exists(options: any) {
    return await this.channelModel.exists(options)
  }

  mapChannel(userId: Types.ObjectId, channelDocument: ChannelDocument) {
    const obj = channelDocument.toObject()

    if(obj.chats) {
      obj.chats = obj.chats.map(data => ({ ...data, messagesCount: data.messagesCount.get(userId.toString()) }))
    }

    return obj
  }

  async countUserChannel(admin: Types.ObjectId | string): Promise<number> {
    return await this.channelModel.find({ admin }).countDocuments();
  }

  async findAll(userId: Types.ObjectId, lastId: string, fields: {} = {}) {
    let query = this.channelModel
      .find({ participants: { $in: userId } }, fields)

    if (lastId) {
      query = query.where('_id').gt(new Types.ObjectId(lastId) as any);
    }

    const channels = (await query
      .limit(ChannelModelService.PER_PAGE_CHANNELS)
      .exec()).map((channel) => this.mapChannel(userId, channel));

    return {
      continue: channels.length === ChannelModelService.PER_PAGE_CHANNELS,
      channels,
    };
  }

  async findById(
    channelId: string | Types.ObjectId,
    fields: {} = {}
  ): Promise<ChannelDocument | null> {
    return await this.channelModel.findById(channelId, fields).exec();
  }

  async findByAdmin(
    _id: string,
    admin: string | Types.ObjectId,
  ): Promise<ChannelDocument | null> {
    const channel = await this.channelModel.findOne({ _id: new Types.ObjectId(_id), admin: new Types.ObjectId(admin) });

    if(!channel) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Channel not found' })
    }

    return channel
  }

  async findAllByAdmin(
    adminId: Types.ObjectId,
    fields: {} = {}
  ) {
    return (await this.channelModel.find({ admin: adminId }, fields).exec()).map((channel) => this.mapChannel(adminId, channel));
  }

  async findByOtherData(data: any, fields: {} = {}): Promise<ChannelDocument | null> {
    const channel = await this.channelModel.findOne(data, fields).exec();

    if(!channel) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Channel not found' })
    }

    return channel
  }

  async create(data: {
    name: string;
    admin: string | Types.ObjectId;
    description?: string;
    photo?: string;
  }): Promise<ChannelDocument | null> {
    let createdChannel = new this.channelModel({
      ...data,
      participants: [data.admin],
    });
    createdChannel = (await createdChannel.save()).toObject();

    delete createdChannel.__v;

    return createdChannel;
  }

  async addParticipant(
    channelId: Types.ObjectId,
    userId: Types.ObjectId,
    fields: {} = {}
  ): Promise<ChannelDocument> {
    return await this.channelModel.findByIdAndUpdate(channelId, {
      $addToSet: { participants: userId },
    }).select(fields);
  }

  async deleteParticipant(
    channelId: Types.ObjectId,
    adminId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<void> {
    await this.channelModel.findOneAndUpdate({ _id: channelId, admin: adminId }, {
      $pull: { participants: participantId },
    });
  }

  async update(
    channelId: Types.ObjectId,
    adminId: Types.ObjectId,
    data: any,
  ) {
    return await this.channelModel.findOneAndUpdate({ _id: channelId, admin: adminId }, data);
  }

  async updateChat(channelId: Types.ObjectId, adminId: Types.ObjectId, chatId: Types.ObjectId, data: any) {
    const channelDocument = await this.findByOtherData({ _id: channelId, admin: adminId })

    const index = channelDocument.chats.findIndex(({ _id }) => _id.equals(chatId))

    if(index === -1) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Chat not found' })
    }

    for(let key in data) {
      channelDocument.chats[index][key] = data[key]
    }

    await channelDocument.save()
  }

  async addChat({ channelId, chatName, adminId }: AddChatRequest) {
    const channelDocument = await this.findByAdmin(channelId, adminId)

    if (channelDocument.chats.length === 5) {
      throw new DefaultHttpException({ status: HttpStatus.FORBIDDEN, message: 'Limit chat exceded' })
    }

    const chatId = new Types.ObjectId();
    const messagesCount = new Map<Types.ObjectId, number>();

    channelDocument.participants.forEach((id) => messagesCount.set(id, 0));

    const chat = { _id: chatId, name: chatName, messagesCount };

    channelDocument.chats.push(chat);

    await channelDocument.save();

    return { channelDocument, chat };
  }

  async deleteChat(
    channelId: Types.ObjectId,
    adminId: Types.ObjectId,
    chatId: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    const channel = await this.findByOtherData({ _id: channelId, admin: adminId })

    channel.chats = channel.chats.filter(
      (chat) => !chat._id.equals(chatId),
    );

    await channel.save();

    return chatId;
  }

  async readMessages(
    channelDocument: ChannelDocument,
    channelChat: ChannelChatType,
    userId: Types.ObjectId,
  ): Promise<void> {
    if (channelDocument.participants.some((id) => id.equals(userId))) {
      channelChat.messagesCount.set(userId, 0);
      await channelDocument.save();
    }
  }

  async delete(channelId: Types.ObjectId, adminId: Types.ObjectId) {
    const deletedChannel = await this.channelModel.findOneAndDelete({ _id: channelId, admin: adminId })

    if(!deletedChannel) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_FOUND, message: 'Channel not found' })
    }

    return deletedChannel
  }
}
