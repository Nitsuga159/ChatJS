import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friends, FriendsDocument } from './friends.model';
import { User, UserDocument } from '../user/user.model';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendModel: Model<FriendsDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async addFriend(newFriend: Friends): Promise<Friends> {
    const friendAdded = new this.friendModel(newFriend);
    return await friendAdded.save();
  }

  async getAllFriendsOfUser(id: string): Promise<User[]> {
    const result = (
      await this.friendModel
        .find({
          $or: [{ userOne: { $eq: id } }, { userTwo: { $eq: id } }],
        })
        .select({ userOne: 1, userTwo: 1, _id: 0 })
        .exec()
    ).map((res) => (res.userOne.toString() === id ? res.userTwo : res.userOne));

    return await Promise.all(
      result.map((_id) => this.userModel.findOne({ _id })),
    );
  }
}
