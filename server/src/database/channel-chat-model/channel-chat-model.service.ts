import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatDocument } from './channel-chat-model';
import { Model, Types } from 'mongoose';
import {
  ChatMessageData,
  MessageType,
  PER_PAGE_MESSAGES,
} from '../types/message.type';
import { ChannelDocument } from '../channel-model/channel.model';

@Injectable()
export class ChannelChatModelService {
  constructor(
    @InjectModel(ChannelChat.name)
    private readonly channelChatModel: Model<ChannelChatDocument>,
  ) {}

  static readonly PER_PAGE_CHANNEL_CHAT = 30;

  async get(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    lastId: string,
  ): Promise<ChannelChatDocument[]> {
    let query = this.channelChatModel
      .find({ channelId, chatId }, { __v: 0, channelId: 0, chatId: 0 })
      .sort({ createdAt: 'desc' })
      .populate('message.sender', 'username photo color');

    if (lastId) {
      query = query.where('_id').lt(new Types.ObjectId(lastId) as any);
    }

    const messages = await query
      .limit(ChannelChatModelService.PER_PAGE_CHANNEL_CHAT)
      .exec();

    return messages.reverse();
  }

  async getImageMessages(idsMessages: string[]): Promise<string[]> {
    return (
      await this.channelChatModel.find({ _id: { $in: idsMessages } }).exec()
    )
      .map((m) => m.message.photos)
      .reduce((actual, next) => [...actual, ...next], []);
  }

  async add(
    chatMessageData: ChatMessageData,
    message: MessageType,
  ): Promise<ChannelChatDocument> {
    let createdMessage = new this.channelChatModel({
      ...chatMessageData,
      message,
    });
    createdMessage = await createdMessage.save();
    createdMessage = (
      await createdMessage.populate('message.sender', 'username photo color')
    ).toObject();

    delete createdMessage.__v;

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
    channelDocument: ChannelDocument,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Types.ObjectId[]> {
    const isAdmin = channelDocument.admin.equals(userId);

    const query = {
      _id: { $in: ids },
      channelId: channelDocument._id,
      chatId,
      $or: [{ 'message.sender': userId }],
    };

    if (isAdmin) (query.$or as any).push({});

    const messageDocuments: { _id: Types.ObjectId }[] =
      await this.channelChatModel.find(query);

    await this.channelChatModel.deleteMany(query);

    return messageDocuments.map(({ _id }) => _id);
  }
}
