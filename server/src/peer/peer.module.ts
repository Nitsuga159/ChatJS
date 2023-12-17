import { Module } from '@nestjs/common';
import { PeerProvider } from './peer.provider';

@Module({
  providers: [PeerProvider],
})
export class PeerModule {}
