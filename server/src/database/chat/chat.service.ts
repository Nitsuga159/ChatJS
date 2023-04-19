import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from './chat.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatUser, Message, NewMessage, PER_PAGE } from './chat.type';
import { ChatSocket } from 'src/ws/chat/chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly chatSocket: ChatSocket,
  ) {}

  async createChat(data: Chat) {
    const chat = await this.chatModel.findOne(data);

    if (chat)
      throw new HttpException(
        'The chat is already created',
        HttpStatus.NOT_ACCEPTABLE,
      );

    return (await new this.chatModel(data).save()).toObject();
  }

  async newMessage({
    sender,
    message,
    _id,
  }: NewMessage): Promise<{ success: boolean }> {
    const chat = await this.chatModel.findById(_id).exec();

    if (!chat)
      throw new HttpException("The chat doesn't exist", HttpStatus.BAD_REQUEST);

    const messageToSend = {
      sender,
      message,
      date: new Date(),
    };

    chat.messages.push(messageToSend);

    await chat.save();

    this.chatSocket.sendMessageToOne({ ...messageToSend, _id });

    return { success: true };
  }

  async getChat(_id: string, page: number): Promise<Message[]> {
    if (page < 0)
      throw new HttpException(
        'The number page must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );

    const chat = await this.chatModel
      .findById(_id, {
        messages: { $slice: [page * PER_PAGE, page * PER_PAGE + PER_PAGE] },
      })
      .populate({ path: 'messages.sender', select: 'username photo color' });

    if (!chat)
      throw new HttpException("The chat doesn't exist", HttpStatus.BAD_REQUEST);

    return chat.messages;
  }

  async getUserChats(_id: string): Promise<ChatUser[]> {
    const chats: any = await this.chatModel
      .find({ userId1: _id, userId2: _id })
      .select('userId1 userId2 _id')
      .exec();

    return chats;
  }
}
