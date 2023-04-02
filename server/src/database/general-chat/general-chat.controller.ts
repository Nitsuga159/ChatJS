import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GeneralChat } from './general-chat.model';
import { GeneralChatService } from './general-chat.service';

@Controller('general-chat')
export class GeneralChatController {
  constructor(private readonly generalChatService: GeneralChatService) {}

  @Get()
  async getGeneralChat() {
    return await this.generalChatService.getGeneralChat();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createMessage(@Body() message: GeneralChat) {
    return await this.generalChatService.createMessage(message);
  }
}
