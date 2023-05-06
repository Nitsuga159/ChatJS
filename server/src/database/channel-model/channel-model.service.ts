import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChannelModelService {
  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>,
  ) {}

  async findAll(userId: Types.ObjectId): Promise<ChannelDocument[]> {
    return await this.channelModel
      .find({ participants: { $in: userId } }, { __v: 0 })
      .populate('admin participants', 'username photo color');
  }

  async findById(channelId: Types.ObjectId): Promise<ChannelDocument | null> {
    return await this.channelModel.findById(channelId, { __v: 0 }).exec();
  }

  async findByAdmin(
    _id: Types.ObjectId,
    admin: Types.ObjectId,
  ): Promise<ChannelDocument | null> {
    return await this.channelModel.findOne({ _id, admin });
  }

  async findByOtherData(data: any): Promise<ChannelDocument | null> {
    return await this.channelModel.findOne(data);
  }

  async count(admin: Types.ObjectId): Promise<number> {
    return await this.channelModel.countDocuments({ admin });
  }

  async create(data: {
    name: string;
    admin: Types.ObjectId;
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
  ): Promise<Types.ObjectId> {
    if (channelDocument.chats.size === 5) throw 'Limit chat exceded';
    if (channelDocument.chats.get(chatName)) throw 'The chat already exists';

    const chatId = new Types.ObjectId();

    channelDocument.chats.set(chatName, chatId);

    await channelDocument.save();

    return chatId;
  }

  async deleteChat(
    channelDocument: ChannelDocument,
    chatName: string,
  ): Promise<Types.ObjectId> {
    const chatId = channelDocument.chats.get(chatName);

    if (!chatId) throw 'Invalid chat name in this channel';

    channelDocument.chats.delete(chatName);

    await channelDocument.save();

    return chatId;
  }
}
