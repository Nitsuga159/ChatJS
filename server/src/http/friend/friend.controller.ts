import { Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import dataValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import makeResponse from 'src/utils/makeResponse';
import FRIEND_MAP from './friend.body';

@Controller('friend')
@UseGuards(UserAccessTokenMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @UseGuards(dataValidationMiddleware(FRIEND_MAP.GET_NOTIFICATION))
  async get(@Req() req: any) {
      return makeResponse(
        await this.friendService.find(req.accessTokenPayload._id, req.query.lastId, req._fields),
        HttpStatus.OK
      )
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(dataValidationMiddleware(FRIEND_MAP.NOTIFICATION), NotificationMiddleware)
  async add(@Req() req: any) {
    return makeResponse(
      await this.friendService.add(req.accessTokenPayload._id, req.body.invitationId, req._fields),
      HttpStatus.CREATED
    )
  }

  @Post('read/:friendId')
  async readMessages(@Req() req: any, @Param('friendId') friendId: string) {
      await this.friendService.readMessages(friendId, req.user._id);
  }
}
