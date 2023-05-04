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

@Controller('friend')
@UseGuards(UserMiddleware)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(@Req() req: any) {
    try {
      return await this.friendService.find(req.user._id, req.query.page);
    } catch (e) {
      throw new HttpException(
        `Error finding friends: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':user2')
  async add(@Param('user2') user2: string, @Req() req: any) {
    try {
      return await this.friendService.add(req.user._id, user2);
    } catch (e) {
      throw new HttpException(
        `Error to add friend: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
