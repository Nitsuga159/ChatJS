import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.model';
import { Model, Types } from 'mongoose';
import { ChannelChatType } from './channel-model.type';

@Injectable()
export class ChannelModelService {
  private static readonly PER_PAGE_CHANNELS: number = 5;

  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>,
  ) {}

  async findByUser(admin: Types.ObjectId | string): Promise<ChannelDocument[]> {
    return await this.channelModel.find({ admin });
  }

  async findAll(
    userId: string | Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: ChannelDocument[] }> {
    let query = this.channelModel
      .find({ participants: { $in: userId } })
      .select('name photo');

    if (lastId) {
      query = query.where('_id').gt(new Types.ObjectId(lastId) as any);
    }

    const results = await query
      .limit(ChannelModelService.PER_PAGE_CHANNELS)
      .exec();

    return {
      continue: results.length === ChannelModelService.PER_PAGE_CHANNELS,
      results,
    };
  }

  async findById(
    channelId: string | Types.ObjectId,
  ): Promise<ChannelDocument | null> {
    return await this.channelModel.findById(channelId, { __v: 0 }).exec();
  }

  async findByAdmin(
    _id: string | Types.ObjectId,
    admin: string | Types.ObjectId,
  ): Promise<ChannelDocument | null> {
    return await this.channelModel.findOne({ _id, admin });
  }

  async findByOtherData(data: any): Promise<ChannelDocument | null> {
    return await this.channelModel.findOne(data, { __v: 0 }).exec();
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
  ): Promise<ChannelDocument> {
    return await this.channelModel.findByIdAndUpdate(channelId, {
      $addToSet: { participants: userId },
    });
  }

  async deleteParticipant(
    channelId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.channelModel.findByIdAndUpdate(channelId, {
      $pull: { participants: userId },
    });
  }

  async update(
    channelId: Types.ObjectId,
    data: any,
  ): Promise<ChannelDocument | null> {
    return await this.channelModel.findByIdAndUpdate(channelId, data);
  }

  async addChat(
    channelDocument: ChannelDocument,
    chatName: string,
  ): Promise<ChannelChatType> {
    if (channelDocument.chats.length === 5) throw 'Limit chat exceded';

    const chatId = new Types.ObjectId();
    const messagesCount = new Map<Types.ObjectId, number>();

    channelDocument.participants.forEach((id) => messagesCount.set(id, 0));

    const chat = { _id: chatId, name: chatName, messagesCount };

    channelDocument.chats.push(chat);

    await channelDocument.save();

    return chat;
  }

  async deleteChat(
    channelDocument: ChannelDocument,
    chatId: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    channelDocument.chats = channelDocument.chats.filter(
      (chat) => !chat._id.equals(chatId),
    );

    await channelDocument.save();

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
}
