import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { ChannelChatService } from './channel-chat.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import {
  PROPS_DELETE_MESSAGES,
  PROPS_NEW_MESSAGE,
  PROPS_READ_MESSAGES,
} from 'src/database/types/message.type';
import {
  FindChatMiddleware,
  FindMiddleware,
} from 'src/database/channel-model/channel-model.middleware';

@Controller('channel-chat')
@UseGuards(UserMiddleware, FindMiddleware, FindChatMiddleware)
export class ChannelChatController {
  constructor(private readonly channelChatService: ChannelChatService) {}

  @Get('message/:channelId')
  async get(@Req() req: any) {
    try {
      return await this.channelChatService.get(
        req.channelDocument._id,
        req.chatId,
        req.query.page,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error finding friend messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('count/:channelId')
  async count(@Req() req: any) {
    try {
      return await this.channelChatService.count(
        req.channelDocument._id,
        req.chatId,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error counting messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('message/:channelId')
  @UseGuards(validateProps(PROPS_NEW_MESSAGE, 'body', false, 'message'))
  async add(@Req() req: any) {
    try {
      return await this.channelChatService.add(
        req.channelDocument._id,
        req.chatId,
        {
          ...req.message,
          sender: req.user._id,
        },
      );
    } catch (e: any) {
      throw new HttpException(
        `Error adding friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('read/:channelId')
  @UseGuards(validateProps(PROPS_READ_MESSAGES, 'body', true, 'read'))
  async addReaded(@Req() req: any) {
    try {
      return await this.channelChatService.addReaded(
        req.read.ids,
        req.channelDocument,
        req.chatId,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error adding readed friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('message/:channelId')
  @UseGuards(validateProps(PROPS_DELETE_MESSAGES, 'body', true, 'delete'))
  async delete(@Req() req: any) {
    try {
      return await this.channelChatService.delete(
        req.delete.ids,
        req.channelDocument,
        req.chatId,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error erasing friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
