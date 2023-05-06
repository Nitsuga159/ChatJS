import { Injectable } from '@nestjs/common';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { Types } from 'mongoose';
import {
  FriendResponse,
  PER_PAGE_FRIEND,
} from 'src/database/friend-model/friend-model.type';

const ObjectId = Types.ObjectId;

@Injectable()
export class FriendService {
  constructor(private readonly friendService: FriendModelService) {}

  async add(
    user1: string | Types.ObjectId,
    user2: string | Types.ObjectId,
  ): Promise<FriendDocument> {
    user1 = new ObjectId(user1.toString());
    user2 = new ObjectId(user2.toString());

    const addedFriend = await this.friendService.add(user1, user2);

    if (!addedFriend) throw 'Invalid data to add a friend';

    return addedFriend;
  }

  async find(
    userId: string | Types.ObjectId,
    page: string,
  ): Promise<{ continue: boolean; results: FriendResponse[] }> {
    userId = new ObjectId(userId.toString());

    const results: FriendResponse[] = await this.friendService.find(
      userId,
      isNaN(+page) || +page < 1 ? 0 : +page - 1,
    );

    return {
      continue: results.length === PER_PAGE_FRIEND,
      results,
    };
  }
}
