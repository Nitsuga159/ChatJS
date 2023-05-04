import { Injectable } from '@nestjs/common';
import { FriendChatDocument } from '../../database/friend-chat-model/friend-chat-model';
import { Ws } from 'src/ws/ws.gateway';
import WS_EVENTS from 'src/ws/ws.type';
import { FriendChatModelService } from 'src/database/friend-chat-model/friend-chat-model.service';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { FriendModelService } from 'src/database/friend-model/friend-model.service';
import {
  MessageType,
  PER_PAGE_MESSAGES,
} from 'src/database/types/message.type';
import { Types } from 'mongoose';

@Injectable()
export class FriendChatService {
  constructor(
    private readonly friendChatModelService: FriendChatModelService,
    private readonly friendModelService: FriendModelService,
    private readonly ws: Ws,
  ) {}

  async get(
    friendId: string,
    page: string,
  ): Promise<{ continue: boolean; results: FriendChatDocument[] }> {
    let currentPage = Number.parseInt(page);

    const messagesFriendChat = await this.friendChatModelService.get(
      friendId,
      isNaN(currentPage) || currentPage < 1 ? 0 : currentPage - 1,
    );

    return {
      continue: messagesFriendChat.length === PER_PAGE_MESSAGES,
      results: messagesFriendChat,
    };
  }

  async count(friendId: string, userId: string): Promise<{ count: number }> {
    return await this.friendChatModelService.count(friendId, userId);
  }

  async add(friendId: string, message: MessageType): Promise<void> {
    const createdMessage: FriendChatDocument =
      await this.friendChatModelService.add(friendId, message);
    const { user1, user2 } = await this.friendModelService.findById(friendId);

    this.ws.emitToGroup(
      [String(user1), String(user2)],
      WS_EVENTS.NEW_MESSAGE,
      createdMessage,
    );
  }

  async addReaded(
    ids: string[],
    friendDocument: FriendDocument,
    userId: string,
  ): Promise<void> {
    await this.friendChatModelService.addReaded(
      ids,
      friendDocument._id,
      userId,
    );
  }

  async delete(
    ids: string[],
    friendDocument: FriendDocument,
    userId: string,
  ): Promise<void> {
    const idsMessages: Types.ObjectId[] =
      await this.friendChatModelService.delete(ids, friendDocument._id, userId);

    const { user1, user2 } = friendDocument;

    this.ws.emitToGroup(
      [String(user1), String(user2)],
      WS_EVENTS.DELETED_MESSAGE,
      idsMessages,
    );
  }
}
