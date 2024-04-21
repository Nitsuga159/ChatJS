import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { NotificationModelModule } from 'src/database/notification-model/notification-model.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [
    FriendModelModule,
    UserModelModule,
    NotificationModelModule,
    WsModule
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}

