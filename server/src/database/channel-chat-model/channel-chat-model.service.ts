import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatDocument } from './channel-chat-model';
import { Model, Types } from 'mongoose';
import {
  ChatMessageData,
  MessageType,
  PER_PAGE_MESSAGES,
} from '../types/message.type';
import queryFilter, { QueryFilterProps } from 'src/utils/queryFilter';
import { ChannelChatChatId } from 'src/http/channel-chat/channel-chat.body';

@Injectable()
export class ChannelChatModelService {
  constructor(
    @InjectModel(ChannelChat.name)
    private readonly channelChatModel: Model<ChannelChatDocument>,
  ) {}

  static readonly PER_PAGE_CHANNEL_CHAT = 30;

  async get(
    channelId: Types.ObjectId,
    queryProps: ChannelChatChatId
  ) {
    let query = this.channelChatModel
      .find({ channelId, chatId: queryProps.chatId }, queryProps.fields)
      .populate('message.sender', 'username photo color');

    const messages = await queryFilter({ query, limit: PER_PAGE_MESSAGES, ...queryProps })

    return messages;
  }

  async getImageMessages(idsMessages: string[]) {
    return (
      await this.channelChatModel.find(
        { _id: { $in: idsMessages } }, 
        { _id: 0, channelId: 0, chatId: 0 }
      ).exec()
    )
      .map((m) => m.message.photos)
      .reduce((actual, next) => [...actual, ...next], []);
  }

  async add(
    { channelId, chatId }: ChatMessageData,
    message: MessageType,
    fields: {} = {}
  ): Promise<ChannelChatDocument> {
    let createdMessage = new this.channelChatModel({
      channelId: new Types.ObjectId(channelId),
      chatId: new Types.ObjectId(chatId),
      message,
    }, fields);
    
    createdMessage = await createdMessage.save();
    
    createdMessage = (
      await createdMessage.populate('message.sender', 'username photo color')
      ).toObject({ useProjection: true });

    return createdMessage;
  }

  async count(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<{ count: number }> {
    return {
      count: await this.channelChatModel.countDocuments({
        channelId,
        chatId,
        'message.readed': { $nin: [userId] },
        'message.sender': { $ne: userId },
      }),
    };
  }

  async addReaded(
    ids: string[],
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.channelChatModel.updateMany(
      {
        _id: { $in: ids },
        'message.readed': { $ne: userId },
        channelId,
        chatId,
      },
      { $addToSet: { 'message.readed': userId } },
    );
  }

  async delete(
    ids: string[],
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
    isAdmin: boolean
  ) {

    const query = {
      _id: { $in: ids },
      channelId: channelId,
      chatId,
      $or: [{ 'message.sender': userId }],
    };

    if(isAdmin) {
      query.$or.push({} as any)
    }

    await this.channelChatModel.deleteMany(query)
  }

  async deleteByChat(channelId: Types.ObjectId, chatId: Types.ObjectId) {
    await this.channelChatModel.deleteMany({ channelId, chatId })
  }

  async deleteByChannel(channelId: Types.ObjectId) {
    await this.channelChatModel.deleteMany({ channelId })
  }
}
