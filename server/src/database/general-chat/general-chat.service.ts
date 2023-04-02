import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GeneralChat, GeneralChatDocument } from './general-chat.model';
import { Model } from 'mongoose';

@Injectable()
export class GeneralChatService {
  constructor(
    @InjectModel(GeneralChat.name)
    private readonly generalChatModel: Model<GeneralChatDocument>,
  ) {}

  async getGeneralChat() {
    return await this.generalChatModel.find().populate('userId', 'name').exec();
  }

  async createMessage(message: GeneralChat) {
    const messageCreated = new this.generalChatModel({
      ...message,
      date: Date.now(),
    });
    return await messageCreated.save();
  }
}
