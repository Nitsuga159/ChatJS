import { Injectable } from '@nestjs/common';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { Ws } from 'src/ws/ws.gateway';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendService: FriendModelService,
    private readonly ws: Ws,
  ) {}

  async add(user1: string, user2: string): Promise<FriendDocument> {
    const addedFriend = await this.friendService.add(user1, user2);

    if (!addedFriend) throw 'Invalid data to add a friend';

    return addedFriend;
  }

  async find(userId: string, page: string): Promise<FriendDocument[]> {
    return await this.friendService.find(
      userId,
      isNaN(+page) || +page < 1 ? 0 : +page - 1,
    );
  }
}
