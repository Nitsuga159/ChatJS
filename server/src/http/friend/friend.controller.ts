import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import makeResponse from 'src/utils/makeResponse';
import { FriendQuery, FriendId } from './friend.body';

@Controller('friend')
@UseGuards(UserAccessTokenMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(@Req() req: any, @Query() query: FriendQuery) {
      return makeResponse(
        await this.friendService.find(req.accessTokenPayload._id, query),
        HttpStatus.OK
      )
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(NotificationMiddleware)
  async add(@Req() req: any, @Query() {  fields }: FriendQuery) {
    return makeResponse(
      await this.friendService.add(req.accessTokenPayload._id, req.body.invitationId, fields),
      HttpStatus.CREATED
    )
  }

  @Post('read/:friendId')
  async readMessages(@Req() req: any, @Param() { friendId }: FriendId) {
      await this.friendService.readMessages(friendId, req.accessTokenPayload._id);
  }
}
