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

  async get(
    friendId: Types.ObjectId,
    lastId: string,
  ): Promise<FriendChatDocument[]> {
    let query = this.friendChatModel
      .find({ friendId }, { __v: 0, friendId: 0 })
      .sort({ createdAt: 'desc' })
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

  async add(
    friendId: Types.ObjectId,
    clientId: string,
    message: MessageType,
  ): Promise<FriendChatDocument> {
    let createdMessage = new this.friendChatModel({
      friendId,
      clientId,
      message,
    });
    createdMessage = await (
      await createdMessage.save()
    ).populate('message.sender', 'username color photo');
    createdMessage = createdMessage.toObject();

    delete createdMessage.__v;

    return createdMessage;
  }

  async delete(
    ids: Types.ObjectId[],
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Types.ObjectId[]> {
    const query = {
      _id: { $in: ids },
      friendId,
      'message.sender': userId,
    };

    const deletedDocuments: { _id: Types.ObjectId }[] =
      await this.friendChatModel.find(query).select('_id').exec();

    await this.friendChatModel.deleteMany(query);

    return deletedDocuments.map(({ _id }) => _id);
  }
}
