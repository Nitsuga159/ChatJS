import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification-model';
import { NotificationMiddleware } from './notification-model.middleware';
import { NotificationModelService } from './notification-model.service';

const NotificationModel = MongooseModule.forFeature([
  { name: Notification.name, schema: NotificationSchema },
]);

@Module({
  imports: [NotificationModel],
  providers: [NotificationMiddleware, NotificationModelService],
  exports: [
    NotificationModel,
    NotificationMiddleware,
    NotificationModelService,
  ],
})
export class NotificationModelModule {}
