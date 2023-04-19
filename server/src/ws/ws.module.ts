import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { Ws } from './ws.gateway';

@Module({
  providers: [WsService, Ws],
  exports: [WsService],
})
export class WsModule {}
