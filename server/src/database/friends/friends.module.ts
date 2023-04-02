import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friends, FriendsSchema } from './friends.model';
import { FriendService } from './friends.service';
import { FriendsController } from './friends.controller';
import { User, UserSchema } from '../user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friends.name, schema: FriendsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FriendService],
  controllers: [FriendsController],
})
export class FriendsModule {}
