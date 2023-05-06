import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelChatDocument } from 'src/database/channel-chat-model/channel-chat-model';
import { ChannelChatModelService } from 'src/database/channel-chat-model/channel-chat-model.service';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import {
  MessageType,
  PER_PAGE_MESSAGES,
} from 'src/database/types/message.type';
import { Ws } from 'src/ws/ws.gateway';
import WS_EVENTS from 'src/ws/ws.type';

const ObjectId = Types.ObjectId;

@Injectable()
export class ChannelChatService {
  constructor(
    private readonly channelChatModelService: ChannelChatModelService,
    private readonly channelModelService: ChannelModelService,
    private readonly ws: Ws,
  ) {}

  async get(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    page: string,
  ): Promise<{ continue: boolean; results: ChannelChatDocument[] }> {
    let currentPage = Number.parseInt(page);

    const messagesChannelChat = await this.channelChatModelService.get(
      channelId,
      chatId,
      isNaN(currentPage) || currentPage < 1 ? 0 : currentPage - 1,
    );

    return {
      continue: messagesChannelChat.length === PER_PAGE_MESSAGES,
      results: messagesChannelChat,
    };
  }

  async count(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<{ count: number }> {
    return this.channelChatModelService.count(channelId, chatId, userId);
  }

  async add(
    channelId: string | Types.ObjectId,
    chatId: string | Types.ObjectId,
    message: MessageType,
  ): Promise<void> {
    channelId = new ObjectId(channelId.toString());
    chatId = new ObjectId(chatId.toString());

    const createdMessage: ChannelChatDocument =
      await this.channelChatModelService.add(channelId, chatId, message);
    const { participants } = await this.channelModelService.findById(channelId);

    this.ws.emitToGroup(participants, WS_EVENTS.NEW_MESSAGE, createdMessage);
  }

  async addReaded(
    ids: string[],
    channelDocument: ChannelDocument,
    chatId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    chatId = new ObjectId(chatId.toString());
    userId = new ObjectId(userId.toString());

    await this.channelChatModelService.addReaded(
      ids,
      channelDocument._id,
      chatId,
      userId,
    );
  }

  async delete(
    ids: string[],
    channelDocument: ChannelDocument,
    chatId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    chatId = new ObjectId(chatId.toString());
    userId = new ObjectId(userId.toString());

    const idsMessages = await this.channelChatModelService.delete(
      ids,
      channelDocument,
      chatId,
      userId,
    );

    const { participants } = channelDocument;

    this.ws.emitToGroup(participants, WS_EVENTS.DELETED_MESSAGE, idsMessages);
  }
}
