import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.model';
import { Message } from './chat.type';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { PROPS_CHAT, PROPS_NEW_MESSAGE } from './chat.type';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get('')
  async getUserChats(@Req() req: any) {
    return req.user;
  }

  @Get(':id')
  async getChat(
    @Param('id') id: string,
    @Query() { page }: { page: string },
  ): Promise<Message[]> {
    return await this.chatService.getChat(
      id,
      Number.isInteger(+page) ? +page - 1 : 0,
    );
  }

  @Post('')
  @UseGuards(validateProps(PROPS_CHAT, 'body', true))
  async createChat(@Req() req: any): Promise<Chat> {
    return await this.chatService.createChat(req.data);
  }

  @Post('message')
  @UseGuards(validateProps(PROPS_NEW_MESSAGE, 'body', true))
  async newMessage(@Req() req): Promise<{ success: boolean }> {
    return await this.chatService.newMessage(req.data);
  }
}
