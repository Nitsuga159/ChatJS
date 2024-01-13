import { HttpStatus, Injectable } from '@nestjs/common';
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { QueryFilterProps } from 'src/utils/queryFilter';

const ObjectId = Types.ObjectId;

@Injectable()
export class FriendChatService {
  constructor(
    private readonly friendChatModelService: FriendChatModelService,
    private readonly friendModelService: FriendModelService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly wsGateway: Ws
  ) {}

  async get(friendId: Types.ObjectId, query: QueryFilterProps) {
    const messagesFriendChat = await this.friendChatModelService.get(friendId, query);

    return {
      continue: messagesFriendChat.length === PER_PAGE_MESSAGES,
      messages: messagesFriendChat,
    };
  }

  async add(friendId: Types.ObjectId, message: MessageType, fields: {} = {}) {
    const createdMessage: FriendChatDocument =
      await this.friendChatModelService.add(friendId, message, fields);

    const friendDocument = await this.friendModelService.findById(friendId);

    const { user1, user2, messagesCount } = friendDocument;

    let userToSend = message.sender.equals(friendDocument.user1) ? user2 : user1;

    messagesCount.set(userToSend, messagesCount.get(userToSend) + 1);

    await friendDocument.save();

    this.wsGateway.addFriendChatMessage(user1, user2, createdMessage)

    return createdMessage
  }

  async delete(
    ids: string[],
    friendId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    if(ids.length > 15) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Exceded limit' })
    }

    const allPhotos = await this.friendChatModelService.getPhotosMessage(ids);

    allPhotos.forEach((url) =>
      this.cloudinaryService.deleteImage(url.match(/CHATJS\/\w+/)[0]),
    );

    await this.friendChatModelService.delete(ids, friendId, userId);

    this.wsGateway.deleteFriendChatMessage(ids, friendId)

    return { ids }
  }
}
