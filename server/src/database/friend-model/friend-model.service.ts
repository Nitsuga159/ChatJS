import { Injectable } from '@nestjs/common';
import { Friend, FriendDocument } from './friend-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FriendDatabaseResponse,
  PER_EXTEND_PAGE_FRIEND,
  PER_PAGE_FRIEND,
} from './friend-model.type';

@Injectable()
export class FriendModelService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
  ) {}

  async find(
    userId: Types.ObjectId,
    lastId: string,
  ): Promise<FriendDatabaseResponse[]> {
    let query = this.friendModel
      .find(
        { haveChat: true, $or: [{ user1: userId }, { user2: userId }] },
        { __v: 0 },
      )
      .populate('user1 user2', 'username photo color')
      .sort({ createdAt: 'desc' });

    if (lastId) {
      query = query.where('_id').lt(new Types.ObjectId(lastId) as any);
    }

    const friends: FriendDocument[] = await query.limit(PER_PAGE_FRIEND).exec();

    return friends.map(({ _id, haveChat, messagesCount, user1, user2 }) => ({
      _id,
      haveChat,
      messagesCount: messagesCount.get(userId),
      friend: (!user1._id.equals(userId) ? user1 : user2) as any,
    }));
  }

  async extendsFind(
    userId: Types.ObjectId,
    page: number,
  ): Promise<Types.ObjectId[]> {
    const skip = page * PER_EXTEND_PAGE_FRIEND;

    const friends: FriendDocument[] = await this.friendModel
      .find(
        { $or: [{ user1: userId }, { user2: userId }] },
        { __v: 0, _id: 0, haveChat: 0 },
      )
      .skip(skip)
      .limit(PER_EXTEND_PAGE_FRIEND)
      .exec();

    return friends.map(({ user1, user2 }) =>
      !user1.equals(userId) ? user1 : user2,
    );
  }

  async findOne(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
  ): Promise<FriendDocument | null> {
    return await this.friendModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });
  }

  async findById(id: Types.ObjectId): Promise<FriendDocument | null> {
    return await this.friendModel.findById(id);
  }

  async findByOtherData(data: any): Promise<FriendDocument | null> {
    return await this.friendModel.findOne(data);
  }

  async add(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
  ): Promise<FriendDocument | null> {
    const isFriend: FriendDocument | null = await this.findOne(user1, user2);

    if (isFriend) return null;

    const messagesCount = new Map<Types.ObjectId, number>();

    messagesCount.set(user1, 0);
    messagesCount.set(user2, 0);

    let addedFriend = new this.friendModel({ user1, user2, messagesCount });
    await addedFriend.populate('user1 user2', 'username photo color');
    addedFriend = (await addedFriend.save()).toObject();

    delete addedFriend.__v;

    return addedFriend;
  }

  async readMessages(
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const friendDocument = await this.friendModel.findById(friendId);

    if (friendDocument) {
      friendDocument.messagesCount.set(userId, 0);
      await friendDocument.save();
    }
  }
}
