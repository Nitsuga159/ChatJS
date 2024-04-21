import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { FriendService } from './friend.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import { FriendQuery, FriendId } from './friend.body';
import { Types } from 'mongoose';
import { ObjectIdParam } from 'src/decorators/objectid-param';

@Controller('friend')
@UseGuards(UserAccessTokenMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async get(@Req() req: any, @Query() query: FriendQuery) {
    return await this.friendService.find(req.accessTokenPayload._id, query)
  }
  
  @Get(":_id/is")
  @HttpCode(HttpStatus.OK)
  async isFriend(@Req() req: any, @ObjectIdParam("_id") _id: Types.ObjectId) {
    return await this.friendService.isFriend(req.accessTokenPayload._id, _id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(NotificationMiddleware)
  async add(@Req() req: any, @Query() { fields }: FriendQuery) {
    return await this.friendService.add(req.accessTokenPayload._id, req.body.invitationId, fields)
  }

  @Post('read/:friendId')
  async readMessages(@Req() req: any, @Param() { friendId }: FriendId) {
    await this.friendService.readMessages(friendId, req.accessTokenPayload._id);
  }
}
