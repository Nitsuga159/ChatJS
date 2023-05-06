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
    page: number,
  ): Promise<FriendChatDocument[]> {
    const skip: number = page * PER_PAGE_MESSAGES;

    return await this.friendChatModel
      .find({ friendId }, { __v: 0, friendId: 0, 'message.readed': 0 })
      .sort({ createdAt: 'desc' })
      .populate('message.sender', 'username photo color')
      .skip(skip)
      .limit(PER_PAGE_MESSAGES)
      .exec();
  }

  async add(
    friendId: Types.ObjectId,
    message: MessageType,
  ): Promise<FriendChatDocument> {
    let createdMessage = new this.friendChatModel({ friendId, message });
    createdMessage = await createdMessage.save();
    createdMessage = createdMessage.toObject();

    delete createdMessage.__v;

    return createdMessage;
  }

  async count(
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<{ count: number }> {
    return {
      count: await this.friendChatModel.countDocuments({
        friendId,
        'message.readed': { $nin: [userId] },
        'message.sender': { $ne: userId },
      }),
    };
  }

  async addReaded(
    ids: Types.ObjectId[],
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.friendChatModel.updateMany(
      { _id: { $in: ids }, 'message.readed': { $ne: userId }, friendId },
      { $addToSet: { 'message.readed': userId } },
    );
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
