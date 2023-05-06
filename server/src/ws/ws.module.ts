import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { Ws } from './ws.gateway';
import { FriendModelModule } from 'src/database/friend-model/friend-model.module';

@Module({
  imports: [FriendModelModule],
  providers: [WsService, Ws],
  exports: [Ws],
})
export class WsModule {}
