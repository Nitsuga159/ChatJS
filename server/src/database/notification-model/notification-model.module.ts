import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification-model';
import { NotificationMiddleware } from './notification-model.middleware';

const NotificationModel = MongooseModule.forFeature([
  { name: Notification.name, schema: NotificationSchema },
]);

@Module({
  imports: [NotificationModel],
  providers: [NotificationMiddleware],
  exports: [NotificationModel, NotificationMiddleware],
})
export class NotificationModelModule {}
