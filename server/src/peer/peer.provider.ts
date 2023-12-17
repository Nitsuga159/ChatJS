import { Injectable } from '@nestjs/common';
import { PeerServer, IClient, PeerServerEvents } from 'peer';

interface PeerType {
  on: (
    event: 'connection' | 'message' | 'disconnect',
    callback: (client: IClient) => void,
  ) => void;
}

@Injectable()
export class PeerProvider {
  private readonly peer: PeerType = PeerServer({ port: 9000 });

  constructor() {
    this.peer.on('connection', (client: IClient) => {
      console.log(`Peer connected: ${client.getId()}`);
    });
  }
}
