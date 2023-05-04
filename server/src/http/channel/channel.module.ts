import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelModelModule } from 'src/database/channel-model/channel-model.module';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { WsModule } from 'src/ws/ws.module';
import { NotificationModelModule } from 'src/database/notification-model/notification-model.module';

@Module({
  imports: [
    ChannelModelModule,
    UserModelModule,
    NotificationModelModule,
    WsModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
