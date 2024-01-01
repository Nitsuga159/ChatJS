import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { NotificationModelModule } from 'src/database/notification-model/notification-model.module';
import fieldsQueryMiddleware from 'src/middlewares/fieldsQuery/fieldsQuery.middleware';

@Module({
  imports: [
    FriendModelModule,
    UserModelModule,
    NotificationModelModule
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      fieldsQueryMiddleware({ 
        allFields: ['_id', 'haveChat', 'messagesCount'], 
        fieldsToOmitDefault: ['__v'] 
      }))
      .forRoutes('/friend',)
  }
}

