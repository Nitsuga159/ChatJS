import { Injectable, Logger } from '@nestjs/common';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import { Types } from 'mongoose';
import { FriendQuery } from './friend.body';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { NotificationModelService } from 'src/database/notification-model/notification-model.service';
import { NotificationType } from 'src/database/notification-model/notification-model.type';
import { Ws } from 'src/ws/ws.gateway';
import { UserDocument } from 'src/database/user-model/user-model';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendModelService: FriendModelService,
    private readonly notificationModelService: NotificationModelService,
    private readonly userModelService: UserModelService,
    private readonly wsService: Ws
  ) {}

  async add(user1Id: Types.ObjectId, user2Id: Types.ObjectId, fields: {} = {}) {
    const { user1, user2, _id } = await this.friendModelService.add(user1Id, user2Id, fields);

    console.log(user1, user2, _id)

    this.wsService.addFriend(_id, user1 as any, user2 as any)

    return true
  }

  async find(userId: Types.ObjectId, query: FriendQuery) {

    let friends = await this.friendModelService.find(userId, query);

    return {
      canContinue: friends.length === FriendModelService.PER_PAGE_FRIEND,
      items: friends,
    };
  }

  async isFriend(userId: Types.ObjectId, friend: Types.ObjectId) {
    if(userId.equals(friend)) {
      Logger.debug("Is same user")
    }

    const user = await this.userModelService.findById(friend, { password: 0, mail: 0, habilited: 0, userType: 0, __v: 0 });

    const hasInvitation = Boolean(await this.notificationModelService.exists({ sender: userId, destined: friend, type: NotificationType.FRIEND }))
    const isFriend = !hasInvitation && Boolean(await this.friendModelService.isFriend({ userId, friend }));

    return {
      hasInvitation,
      isFriend,
      user
    }
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
