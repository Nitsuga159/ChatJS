import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { FriendService } from './friend.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import { FriendResponse } from 'src/database/friend-model/friend-model.type';

@Controller('friend')
@UseGuards(UserMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(
    @Req() req: any,
  ): Promise<{ continue: boolean; results: FriendResponse[] }> {
    try {
      return await this.friendService.find(req.user._id, req.query.page);
    } catch (e) {
      throw new HttpException(
        `Error finding friends: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @UseGuards(NotificationMiddleware)
  async add(@Req() req: any) {
    try {
      return await this.friendService.add(
        req.user._id,
        req.notification.invitationId,
      );
    } catch (e) {
      throw new HttpException(
        `Error to add friend: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
