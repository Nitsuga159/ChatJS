import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChannelChatDocument } from 'src/database/channel-chat-model/channel-chat-model';
import { ChannelChatModelService } from 'src/database/channel-chat-model/channel-chat-model.service';
import { ChannelModelService } from 'src/database/channel-model/channel-model.service';
import {
  ChatMessageData,
  MessageType,
} from 'src/database/types/message.type';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import { Ws } from 'src/ws/ws.gateway';
import { ChannelChatChatId } from './channel-chat.body';

@Injectable()
export class ChannelChatService {
  constructor(
    private readonly channelChatModelService: ChannelChatModelService,
    private readonly channelModelService: ChannelModelService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly wsGateway: Ws
  ) {}
 
  async get(
    userId: Types.ObjectId,
    channelId: Types.ObjectId,
    queryProps: ChannelChatChatId
    
  ) {
    const isMember = await this.channelModelService.isMember({ userId, channelId })

    if(!isMember) {
      throw new DefaultHttpException({ status: HttpStatus.FORBIDDEN, message: 'Data doesn\'t match' })
    }

    const messagesChannelChat = await this.channelChatModelService.get(
      channelId,
      queryProps
    );

    return {
      continue: messagesChannelChat.length === ChannelChatModelService.PER_PAGE_CHANNEL_CHAT,
      messages: messagesChannelChat,
    };
  }

  async add(chatMessageData: ChatMessageData, message: MessageType, fields: {} = {}) {
    const { channelId, chatId } = chatMessageData;

    const isMemberAndHasChat = await this.channelModelService.isMemberAndHasChat({ userId: message.sender, channelId, chatId })

    if(!isMemberAndHasChat) {
      throw new DefaultHttpException({ status: HttpStatus.FORBIDDEN, message: 'Data doesn\'t match' })
    }
 
    const createdMessage: ChannelChatDocument =
      await this.channelChatModelService.add(chatMessageData, message, fields);

    const channelDocument = await this.channelModelService.findById(channelId);

    const { participants } = channelDocument;
    
    const chatIndex = channelDocument.chats.findIndex(
      (chat) => chat._id.equals(chatId),
    );

    const { messagesCount } = channelDocument.chats[chatIndex];

    //increment messages in pending
    participants.forEach((id) => {
      if (!id.equals(message.sender)) {
        messagesCount.set(id, messagesCount.get(id) + 1);
      }
    });

    await channelDocument.save()

    this.wsGateway.addChannelChatMessage(createdMessage)

    return createdMessage
  }

  async delete(
    ids: string[],
    channelId: Types.ObjectId,
    chatId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    if(ids.length > 15) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Exceded limit' })
    }

    const isAdmin = !!(await this.channelModelService.isAdmin({ adminId: userId, channelId }))

    const allPhotos = await this.channelChatModelService.getImageMessages(ids);

    await this.channelChatModelService.delete(
      ids,
      channelId,
      chatId,
      userId,
      isAdmin
    );

    allPhotos.forEach((url) =>
      this.cloudinaryService.deleteImage(url.match(/CHATJS\/\w+/)[0]),
    );

    this.wsGateway.deleteChannelChatMessage(ids, channelId, chatId)

    return { ids }
  }
}
