import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendChat, FriendChatDocument } from './friend-chat-model';
import { Model, Types } from 'mongoose';
import { MessageType, PER_PAGE_MESSAGES } from '../types/message.type';
import queryFilter, { QueryFilterProps } from 'src/utils/queryFilter';

@Injectable()
export class FriendChatModelService {
  constructor(
    @InjectModel(FriendChat.name)
    private readonly friendChatModel: Model<FriendChatDocument>,
  ) {}

  async get(friendId: Types.ObjectId, queryProps: QueryFilterProps) {
    let query = this.friendChatModel
      .find({ friendId }, queryProps.fields)
      .populate('message.sender', 'username photo color');

    const messages = await queryFilter({ query, limit: PER_PAGE_MESSAGES, ...queryProps });

    return messages;
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
