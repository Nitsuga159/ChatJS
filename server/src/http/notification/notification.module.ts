import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { WsModule } from 'src/ws/ws.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { NotificationModelModule } from 'src/database/notification-model/notification-model.module';
import { ChannelModelModule } from 'src/database/channel-model/channel-model.module';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import fieldsQuery from '../../middlewares/fieldsQuery/fieldsQuery.middleware'

@Module({
  imports: [NotificationModelModule, UserModelModule, WsModule, ChannelModelModule, FriendModelModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      fieldsQuery({ 
        allFields: ['_id', 'sender', 'destined', 'invitationId', 'type', 'createdAt', 'updatedAt'], 
        fieldsToOmitDefault: ['__v'] 
      }))
      .forRoutes('/notification')
  }
}

