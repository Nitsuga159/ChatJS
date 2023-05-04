import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatDocument } from './channel-chat-model';
import { Model, Types } from 'mongoose';
import { MessageType, PER_PAGE_MESSAGES } from '../types/message.type';
import { ChannelDocument } from '../channel-model/channel.model';

@Injectable()
export class ChannelChatModelService {
  constructor(
    @InjectModel(ChannelChat.name)
    private readonly channelChatModel: Model<ChannelChatDocument>,
  ) {}

  async get(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    page: number,
  ): Promise<ChannelChatDocument[]> {
    const skip: number = page * PER_PAGE_MESSAGES;

    return await this.channelChatModel
      .find(
        { channelId, chatId },
        { __v: 0, channelId: 0, chatId: 0, 'message.readed': 0 },
      )
      .sort({ createdAt: 'desc' })
      .populate('message.sender', 'username photo color')
      .skip(skip)
      .limit(PER_PAGE_MESSAGES)
      .exec();
  }

  async add(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    message: MessageType,
  ): Promise<ChannelChatDocument> {
    let createdMessage = new this.channelChatModel({
      channelId,
      chatId,
      message,
    });
    createdMessage = await createdMessage.save();
    createdMessage = createdMessage.toObject();

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
      $or: [{ 'message.sender': userId }, {}],
    };

    if (isAdmin) query['isAdmin'] = true;

    const messageDocuments: { _id: Types.ObjectId }[] =
      await this.channelChatModel.find(query);

    await this.channelChatModel.deleteMany(query);

    return messageDocuments.map(({ _id }) => _id);
  }
}
