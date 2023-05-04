import { Injectable } from '@nestjs/common';
import { Friend, FriendDocument } from './friend-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PER_PAGE_FRIEND } from './friend-model.type';

@Injectable()
export class FriendModelService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
  ) {}

  async find(userId: string, page: number): Promise<FriendDocument[]> {
    const skip = page * PER_PAGE_FRIEND;

    return await this.friendModel
      .find({ $or: [{ user1: userId }, { user2: userId }] }, { __v: 0 })
      .populate('user1 user2', 'username photo color')
      .skip(skip)
      .limit(PER_PAGE_FRIEND)
      .exec();
  }

  async findOne(user1: string, user2: string): Promise<FriendDocument | null> {
    return await this.friendModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });
  }

  async findById(id: string): Promise<FriendDocument | null> {
    return await this.friendModel.findById(id);
  }

  async findByOtherData(data: any): Promise<FriendDocument | null> {
    return await this.friendModel.findOne(data);
  }

  async add(user1: string, user2: string): Promise<FriendDocument | null> {
    const isFriend: FriendDocument | null = await this.findOne(user1, user2);

    if (isFriend) return null;

    let addedFriend = new this.friendModel({ user1, user2 });

    addedFriend = (await addedFriend.save()).toObject();

    delete addedFriend.__v;

    return addedFriend;
  }

  async activeChat(id: string): Promise<void> {
    const friendDocument = await this.findById(id);

    friendDocument.haveChat = true;

    await friendDocument.save();
  }
}
