import { Injectable } from '@nestjs/common';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { Types } from 'mongoose';
import {
  FriendDatabaseResponse,
  PER_PAGE_FRIEND,
} from 'src/database/friend-model/friend-model.type';
import { Ws } from 'src/ws/ws.gateway';
import { WS_FRIEND } from 'src/ws/ws.events';

const ObjectId = Types.ObjectId;

@Injectable()
export class FriendService {
  constructor(
    private readonly friendModelService: FriendModelService,
    private readonly ws: Ws,
  ) {}

  async add(
    user1: string | Types.ObjectId,
    user2: string | Types.ObjectId,
  ): Promise<void> {
    user1 = new ObjectId(user1.toString());
    user2 = new ObjectId(user2.toString());

    const addedFriend = await this.friendModelService.add(user1, user2);

    if (!addedFriend) throw 'Invalid data to add a friend';

    const { _id, haveChat } = addedFriend;

    const friendDefault = {
      _id,
      haveChat,
      messagesCount: 0,
    };

    this.ws.emitToOne(user1, WS_FRIEND.NEW_FRIEND, {
      ...friendDefault,
      friend: addedFriend.user2,
    });
    this.ws.emitToOne(user2, WS_FRIEND.NEW_FRIEND, {
      ...friendDefault,
      friend: addedFriend.user1,
    });
  }

  async find(
    userId: string | Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: FriendDatabaseResponse[] }> {
    userId = new ObjectId(userId.toString());

    let results: FriendDatabaseResponse[] = await this.friendModelService.find(
      userId,
      lastId,
    );

    return {
      continue: results.length === PER_PAGE_FRIEND,
      results,
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
