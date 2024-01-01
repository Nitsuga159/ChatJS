import { Injectable } from '@nestjs/common';
import { Friend, FriendDocument } from './friend-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PER_EXTEND_PAGE_FRIEND } from './friend-model.type';
import { FriendService } from 'src/http/friend/friend.service';

@Injectable()
export class FriendModelService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
  ) {}

  async existsFriend(friendId: Types.ObjectId) {
    return await this.friendModel.exists({ _id: friendId })
  }

  async isFriend({ userId, friend }: { userId: Types.ObjectId, friend: Types.ObjectId }) {
    return await this.friendModel.exists(
      { $or: [{ user1: userId, user2: friend }, { user1: friend, user2: userId }] }
    )
  }

  async find(userId: Types.ObjectId, lastId: Types.ObjectId, fields: {} = {}) {
    let query = this.friendModel
      .find(
        {  $or: [{ user1: userId }, { user2: userId }] },
        fields,
      )
      .populate('user1 user2', 'username photo color')
      .sort({ _id: 'desc' });

    if (lastId) {
      query = query.where('_id').lt(new Types.ObjectId(lastId) as any);
    }

    const friends = await query.limit(FriendModelService.PER_PAGE_FRIEND).exec();

    return friends.map(({ _id, haveChat, messagesCount, user1, user2 }) => ({
      _id,
      haveChat,
      messagesCount: messagesCount.get(userId),
      friend: (!user1._id.equals(userId) ? user1 : user2) as any,
    })).reverse()
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

  async findByOtherData(data: any) {
    return await this.friendModel.findOne(data);
  }

  async add(userId: Types.ObjectId, friendId: Types.ObjectId, fields: {} = {}) {
    const messagesCount = new Map<Types.ObjectId, number>();

    messagesCount.set(userId, 0);
    messagesCount.set(friendId, 0);

    let addedFriend: any = new this.friendModel({ user1: userId, user2: friendId, messagesCount }, fields);

    await addedFriend.populate('user1 user2', 'username photo color');

    addedFriend = (await addedFriend.save()).toObject({ useProjection: true });

    addedFriend.messagesCount = 0 as any
    addedFriend.friend = addedFriend.user2

    delete addedFriend.user1
    delete addedFriend.user2

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

  static readonly PER_PAGE_FRIEND = 15
}
