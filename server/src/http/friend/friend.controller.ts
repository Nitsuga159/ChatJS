import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { FriendService } from './friend.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import { FriendDatabaseResponse } from 'src/database/friend-model/friend-model.type';

@Controller('friend')
@UseGuards(UserMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(
    @Req() req: any,
  ): Promise<{ continue: boolean; results: FriendDatabaseResponse[] }> {
    try {
      return await this.friendService.find(req.user._id, req.query.lastId);
    } catch (e) {
      throw new HttpException(
        `Error finding friends: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @UseGuards(NotificationMiddleware)
  async add(@Req() req: any): Promise<void> {
    try {
      await this.friendService.add(req.user._id, req.notification.invitationId);
    } catch (e) {
      throw new HttpException(
        `Error to add friend: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('read/:friendId')
  async readMessages(
    @Req() req: any,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    try {
      await this.friendService.readMessages(friendId, req.user._id);
    } catch (e) {
      throw new HttpException(
        `Error to read friend messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
