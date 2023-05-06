import { Injectable } from '@nestjs/common';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { Ws } from 'src/ws/ws.gateway';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { Types } from 'mongoose';
import { PER_PAGE_FRIEND } from 'src/database/friend-model/friend-model.type';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendService: FriendModelService,
    private readonly ws: Ws,
  ) {}

  async add(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
  ): Promise<FriendDocument> {
    const addedFriend = await this.friendService.add(user1, user2);

    if (!addedFriend) throw 'Invalid data to add a friend';

    return addedFriend;
  }

  async find(
    userId: Types.ObjectId,
    page: string,
  ): Promise<{ continue: boolean; results: FriendDocument[] }> {
    const results: FriendDocument[] = await this.friendService.find(
      userId,
      isNaN(+page) || +page < 1 ? 0 : +page - 1,
    );

    return {
      continue: results.length === PER_PAGE_FRIEND,
      results,
    };
  }
}
