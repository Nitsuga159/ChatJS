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
import { FriendChatService } from './friend-chat.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { FriendMiddleware } from 'src/database/friend-model/friend-model.middleware';
import {
  PROPS_DELETE_MESSAGES,
  PROPS_NEW_MESSAGE,
  PROPS_READ_MESSAGES,
} from 'src/database/types/message.type';
import { FriendChatDocument } from 'src/database/friend-chat-model/friend-chat-model';

@Controller('friend-chat')
@UseGuards(UserMiddleware, FriendMiddleware)
export class FriendChatController {
  constructor(private readonly friendChatService: FriendChatService) {}

  @Get('message/:friendId')
  async get(
    @Req() req: any,
  ): Promise<{ continue: boolean; results: FriendChatDocument[] }> {
    try {
      return await this.friendChatService.get(
        req.friendDocument._id,
        req.query.page,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error finding friend messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('count/:friendId')
  async count(@Req() req: any): Promise<{ count: number }> {
    try {
      return await this.friendChatService.count(
        req.friendDocument._id,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error counting messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('message/:friendId')
  @UseGuards(validateProps(PROPS_NEW_MESSAGE, 'body', false, 'message'))
  async add(@Req() req: any) {
    try {
      return await this.friendChatService.add(req.friendDocument._id, {
        ...req.message,
        sender: req.user._id,
      });
    } catch (e: any) {
      throw new HttpException(
        `Error adding friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('read/:friendId')
  @UseGuards(validateProps(PROPS_READ_MESSAGES, 'body', true, 'read'))
  async addReaded(@Req() req: any) {
    try {
      return await this.friendChatService.addReaded(
        req.read.ids,
        req.friendDocument,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error adding readed friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('message/:friendId')
  @UseGuards(validateProps(PROPS_DELETE_MESSAGES, 'body', true, 'delete'))
  async delete(@Req() req: any) {
    try {
      return await this.friendChatService.delete(
        req.delete.ids,
        req.friendDocument,
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
