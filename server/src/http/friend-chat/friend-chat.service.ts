import { Injectable } from '@nestjs/common';
import { FriendChatDocument } from '../../database/friend-chat-model/friend-chat-model';
import { Ws } from 'src/ws/ws.gateway';
import { FriendChatModelService } from 'src/database/friend-chat-model/friend-chat-model.service';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import {
  MessageType,
  PER_PAGE_MESSAGES,
} from 'src/database/types/message.type';
import { Types } from 'mongoose';
import { WS_FRIEND } from 'src/ws/ws.events';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class FriendChatService {
  constructor(
    private readonly friendChatModelService: FriendChatModelService,
    private readonly friendModelService: FriendModelService,
    private readonly ws: Ws,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async get(
    friendId: string | Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: FriendChatDocument[] }> {
    friendId = new ObjectId(friendId.toString());

    const messagesFriendChat = await this.friendChatModelService.get(
      friendId,
      lastId,
    );

    return {
      continue: messagesFriendChat.length === PER_PAGE_MESSAGES,
      results: messagesFriendChat,
    };
  }

  async add(
    friendId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    clientId: string,
    message: MessageType,
  ): Promise<void> {
    friendId = new ObjectId(friendId.toString());
    userId = new ObjectId(userId.toString());

    const createdMessage: FriendChatDocument =
      await this.friendChatModelService.add(friendId, clientId, message);

    const friendDocument = await this.friendModelService.findById(friendId);

    const { user1, user2, messagesCount } = friendDocument;

    let userToSend = userId.equals(friendDocument.user1) ? user2 : user1;

    messagesCount.set(userToSend, messagesCount.get(userToSend) + 1);

    await friendDocument.save();

    this.ws.emitToGroup([user1, user2], WS_FRIEND.NEW_FRIEND_MESSAGE, {
      message: createdMessage,
      friendId,
    });
  }

  async delete(
    ids: Types.ObjectId[],
    friendDocument: FriendDocument,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    userId = new ObjectId(userId.toString());

    const allPhotos = await this.friendChatModelService.getPhotosMessage(
      ids as unknown as string[],
    );

    console.log(allPhotos);
    allPhotos.forEach((url) =>
      this.cloudinaryService.deleteImage(url.match(/CHATJS\/\w+/)[0]),
    );

    const idsMessages: Types.ObjectId[] =
      await this.friendChatModelService.delete(ids, friendDocument._id, userId);

    const { user1, user2 } = friendDocument;

    this.ws.emitToGroup([user1, user2], WS_FRIEND.DELETE_FRIEND_MESSAGE, {
      ids: idsMessages,
      friendId: friendDocument._id,
    });
  }
}
