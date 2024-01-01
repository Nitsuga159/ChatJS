import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendChat, FriendChatDocument } from './friend-chat-model';
import { Model, Types } from 'mongoose';
import { MessageType, PER_PAGE_MESSAGES } from '../types/message.type';

@Injectable()
export class FriendChatModelService {
  constructor(
    @InjectModel(FriendChat.name)
    private readonly friendChatModel: Model<FriendChatDocument>,
  ) {}

  async get(friendId: Types.ObjectId, lastId?: Types.ObjectId, fields: {} = {}) {
    let query = this.friendChatModel
      .find({ friendId }, fields)
      .sort({ _id: 'desc' })
      .populate('message.sender', 'username photo color');

    if (lastId) {
      query = query.where('_id').lt(new Types.ObjectId(lastId) as any);
    }

    const messages = await query.limit(PER_PAGE_MESSAGES).exec();

    return messages.reverse();
  }

  async getPhotosMessage(messagesIds: string[]): Promise<string[]> {
    return (
      await this.friendChatModel.find({ _id: { $in: messagesIds } })
    ).reduce((array, { message }) => [...array, ...message.photos], []);
  }

  async add(friendId: Types.ObjectId, message: MessageType, fields: {} = {}) {
    let createdMessage = new this.friendChatModel({
      friendId,
      message,
    }, fields);

    createdMessage = await (
      await createdMessage.save()
    ).populate('message.sender', 'username color photo');

    createdMessage = createdMessage.toObject({ useProjection: true });

    return createdMessage;
  }

  async delete(ids: string[], friendId: Types.ObjectId, userId: Types.ObjectId) {
    const query = {
      _id: { $in: ids },
      friendId,
      'message.sender': userId,
    };

    await this.friendChatModel.deleteMany(query).exec();
  }
}
