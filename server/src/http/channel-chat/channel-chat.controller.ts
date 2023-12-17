import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { ChannelChatService } from './channel-chat.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { PROPS_DELETE_MESSAGES } from 'src/database/types/message.type';
import {
  FindChatMiddleware,
  FindChannelMiddleware,
} from 'src/database/channel-model/channel-model.middleware';

@Controller('channel-chat')
@UseGuards(UserMiddleware, FindChannelMiddleware, FindChatMiddleware)
export class ChannelChatController {
  constructor(private readonly channelChatService: ChannelChatService) {}

  @Get('message/:channelId')
  async get(@Req() req: any) {
    try {
      return await this.channelChatService.get(
        req.channelDocument._id,
        req.chatId,
        req.query.lastId,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error finding chat channel messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('message/:channelId')
  @UseGuards(
    validateProps(
      ChannelChatController.PROPS_NEW_MESSAGE,
      'body',
      false,
      'message',
    ),
    validateProps(
      ChannelChatController.PROPS_MESSAGE_DATA,
      'query',
      true,
      'messageData',
    ),
  )
  async add(@Req() req: any) {
    try {
      return await this.channelChatService.add(
        {
          clientId: req.query.clientId,
          chatId: req.chatId,
          channelId: req.channelDocument._id,
        },
        {
          ...req.message,
          sender: req.user._id,
        },
      );
    } catch (e: any) {
      throw new HttpException(
        `Error adding chat channel message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('message/:channelId')
  @UseGuards(validateProps(PROPS_DELETE_MESSAGES, 'query', true, 'delete'))
  async delete(@Req() req: any) {
    try {
      return await this.channelChatService.delete(
        req.delete.ids.split(','),
        req.channelDocument,
        req.chatId,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error erasing chat channel message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private static readonly PROPS_NEW_MESSAGE = ['value', 'photos'];
  private static readonly PROPS_MESSAGE_DATA = ['chatId', 'clientId'];
}
