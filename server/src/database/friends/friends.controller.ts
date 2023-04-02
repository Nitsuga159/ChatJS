import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FriendService } from './friends.service';
import { Friends } from './friends.model';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendService) {}

  @Get(':id')
  async getAllFriendsOfUser(@Param('id') id: string) {
    return await this.friendsService.getAllFriendsOfUser(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async addFriend(@Body() newFriend: Friends) {
    return await this.friendsService.addFriend(newFriend);
  }
}
