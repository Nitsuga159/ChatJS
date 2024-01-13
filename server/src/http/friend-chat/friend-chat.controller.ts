import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendChatService } from './friend-chat.service';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import makeResponse from 'src/utils/makeResponse';
import { BodyMapFriendChatAddMessage, FriendChatQuery, FriendChatId, FriendChatIds } from './friend-chat.body';

@Controller('friend-chat')
@UseGuards(UserAccessTokenMiddleware)
export class FriendChatController {
  constructor(private readonly friendChatService: FriendChatService) { }

  @Get(':friendId')
  @HttpCode(HttpStatus.OK)
  async get(@Query() query: FriendChatQuery, @Param() { friendId }: FriendChatId) {
    return makeResponse(
      await this.friendChatService.get(
        friendId,
        query
      ),
      HttpStatus.OK
    )
  }

  @Post(':friendId')
  @HttpCode(HttpStatus.OK)
  async add(
    @Req() { accessTokenPayload }: any, 
    @Query() { fields }: FriendChatQuery, 
    @Param() { friendId }: FriendChatId,
    @Body() { message }: BodyMapFriendChatAddMessage
  ) {
    return makeResponse(
      await this.friendChatService.add(
        friendId,
        { ...message, sender: accessTokenPayload._id },
        fields
      ),
      HttpStatus.OK
    )
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() { accessTokenPayload }: any, @Query() { ids }: FriendChatIds, @Param() { friendId }: FriendChatId) {
    return makeResponse(
      await this.friendChatService.delete(
        ids.split(','),
        friendId,
        accessTokenPayload._id,
      ),
      HttpStatus.OK
    )
  }
}
