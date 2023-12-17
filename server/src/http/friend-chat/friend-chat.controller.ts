import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { FriendChatService } from './friend-chat.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { FriendMiddleware } from 'src/database/friend-model/friend-model.middleware';
import { PROPS_DELETE_MESSAGES } from 'src/database/types/message.type';
import { FriendChatDocument } from 'src/database/friend-chat-model/friend-chat-model';
import { FriendDocument } from 'src/database/friend-model/friend-model';

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
        req.query.lastId,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error finding friend messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('message/:friendId')
  @UseGuards(
    validateProps(
      FriendChatController.PROPS_NEW_MESSAGE,
      'body',
      false,
      'message',
    ),
  )
  async add(@Req() req: any): Promise<void> {
    try {
      const friendDocument = req.friendDocument as FriendDocument;

      if (!friendDocument.haveChat) {
        friendDocument.haveChat = true;
        await friendDocument.save();
      }

      await this.friendChatService.add(
        friendDocument._id,
        req.user._id,
        req.query.clientId,
        {
          ...req.message,
          sender: req.user._id,
        },
      );
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        `Error adding friend message: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('message/:friendId')
  @UseGuards(validateProps(PROPS_DELETE_MESSAGES, 'query', true, 'delete'))
  async delete(@Req() req: any) {
    try {
      return await this.friendChatService.delete(
        req.delete.ids.split(','),
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

  private static readonly PROPS_NEW_MESSAGE = ['value', 'photos'];
}
