import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { WsModule } from 'src/ws/ws.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { NotificationModelModule } from 'src/database/notification-model/notification-model.module';

@Module({
  imports: [NotificationModelModule, UserModelModule, WsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
