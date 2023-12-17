import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelChatDocument } from 'src/database/channel-chat-model/channel-chat-model';
import { ChannelChatModelService } from 'src/database/channel-chat-model/channel-chat-model.service';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import {
  ChatMessageData,
  MessageType,
  PER_PAGE_MESSAGES,
} from 'src/database/types/message.type';
import { WS_CHANNEL } from 'src/ws/ws.events';
import { Ws } from 'src/ws/ws.gateway';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class ChannelChatService {
  constructor(
    private readonly channelChatModelService: ChannelChatModelService,
    private readonly channelModelService: ChannelModelService,
    private readonly ws: Ws,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async get(
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    lastId: string,
  ): Promise<{ continue: boolean; results: ChannelChatDocument[] }> {
    const messagesChannelChat = await this.channelChatModelService.get(
      channelId,
      chatId,
      lastId,
    );

    return {
      continue:
        messagesChannelChat.length ===
        ChannelChatModelService.PER_PAGE_CHANNEL_CHAT,
      results: messagesChannelChat,
    };
  }

  async add(
    chatMessageData: ChatMessageData,
    message: MessageType,
  ): Promise<void> {
    const { channelId, chatId } = chatMessageData;
    const createdMessage: ChannelChatDocument =
      await this.channelChatModelService.add(chatMessageData, message);
    const channelDocument = await this.channelModelService.findById(channelId);

    const { participants } = channelDocument;
    const chatIndex = channelDocument.chats.findIndex(
      (chat) => chat._id.toString() === chatId.toString(),
    );

    if (chatIndex < 0) throw 'Invalid chat';

    const { messagesCount } = channelDocument.chats[chatIndex];

    participants.forEach((id) => {
      if (!id.equals(message.sender))
        messagesCount.set(id, messagesCount.get(id) + 1);
    });

    await channelDocument.save();

    this.ws.emitToGroup(
      participants,
      WS_CHANNEL.NEW_CHANNEL_MESSAGE,
      createdMessage,
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

    const allPhotos = await this.channelChatModelService.getImageMessages(ids);

    const idsMessages = await this.channelChatModelService.delete(
      ids,
      channelDocument,
      chatId,
      userId,
    );

    const { participants } = channelDocument;

    this.ws.emitToGroup(participants, WS_CHANNEL.DELETE_CHANNEL_MESSAGE, {
      chatId,
      ids: idsMessages.map((id) => id.toString()),
    });

    console.log(allPhotos);
    allPhotos.forEach((url) =>
      this.cloudinaryService.deleteImage(url.match(/CHATJS\/\w+/)[0]),
    );
  }
}
