import { Injectable } from '@nestjs/common';
import { Friend, FriendDocument } from './friend-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PER_EXTEND_PAGE_FRIEND, PER_PAGE_FRIEND } from './friend-model.type';

@Injectable()
export class FriendModelService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
  ) {}

  async find(userId: Types.ObjectId, page: number): Promise<FriendDocument[]> {
    const skip = page * PER_PAGE_FRIEND;

    return await this.friendModel
      .find({ $or: [{ user1: userId }, { user2: userId }] }, { __v: 0 })
      .populate('user1 user2', 'username photo color')
      .skip(skip)
      .limit(PER_PAGE_FRIEND)
      .exec();
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

    let addedFriend = new this.friendModel({ user1, user2 });

    addedFriend = (await addedFriend.save()).toObject();

    delete addedFriend.__v;

    return addedFriend;
  }

  async activeChat(id: Types.ObjectId): Promise<void> {
    const friendDocument = await this.findById(id);

    friendDocument.haveChat = true;

    await friendDocument.save();
  }
}
