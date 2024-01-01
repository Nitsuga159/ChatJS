import { Injectable } from '@nestjs/common';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { Types } from 'mongoose';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendModelService: FriendModelService
  ) {}

  async add(user1: Types.ObjectId, user2: Types.ObjectId, fields: {} = {}) {
    return await this.friendModelService.add(user1, user2, fields);
  }

  async find(userId: Types.ObjectId, lastId: Types.ObjectId, fields: {} = {}) {

    let friends = await this.friendModelService.find(userId, lastId, fields);

    return {
      continue: friends.length === FriendModelService.PER_PAGE_FRIEND,
      friends,
    };
  }

  async readMessages(
    friendId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    friendId = new Types.ObjectId(friendId.toString());
    userId = new Types.ObjectId(userId.toString());

    await this.friendModelService.readMessages(friendId, userId);
  }

}
