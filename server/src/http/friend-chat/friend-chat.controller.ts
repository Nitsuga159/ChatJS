import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendChatService } from './friend-chat.service';
import { FriendChatDocument } from 'src/database/friend-chat-model/friend-chat-model';
import { FriendDocument } from 'src/database/friend-model/friend-model';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import dataValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import FRIEND_CHAT_MAP from './friend-chat.body';
import makeResponse from 'src/utils/makeResponse';

@Controller('friend-chat')
@UseGuards(UserAccessTokenMiddleware)
export class FriendChatController {
  constructor(private readonly friendChatService: FriendChatService) { }

  @Get(':friendId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(dataValidationMiddleware(FRIEND_CHAT_MAP.GET_MESSAGES))
  async get(@Req() { accessTokenPayload, query, params, _fields }: any) {
    return makeResponse(
      await this.friendChatService.get(
        params.friendId,
        accessTokenPayload._id,
        query.lastId,
        _fields
      ),
      HttpStatus.OK
    )
  }

  @Post(':friendId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(dataValidationMiddleware(FRIEND_CHAT_MAP.ADD_MESSAGE))
  async add(@Req() { body, params, accessTokenPayload, _fields }: any) {
    return makeResponse(
      await this.friendChatService.add(
        params.friendId,
        { ...body.message, sender: accessTokenPayload._id },
        _fields
      ),
      HttpStatus.OK
    )
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(dataValidationMiddleware(FRIEND_CHAT_MAP.DELETE_MESSAGE))
  async delete(@Req() { query, params, accessTokenPayload }: any) {
    return makeResponse(
      await this.friendChatService.delete(
        query.ids.split(','),
        params.friendId,
        accessTokenPayload._id,
      ),
      HttpStatus.OK
    )
  }
}
