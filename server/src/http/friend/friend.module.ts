import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { WsModule } from 'src/ws/ws.module';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';

@Module({
  imports: [FriendModelModule, UserModelModule, WsModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
