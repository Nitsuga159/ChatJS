import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsService {
  private connections: Map<string, Socket> = new Map<string, Socket>();

  set(id: string, socket: Socket): void {
    this.connections.set(id, socket);
  }

  getAll(): Socket[] {
    return [...this.connections.values()];
  }

  get(id: string): Socket | null {
    return this.connections.get(id);
  }

  delete(id: string): void {
    this.connections.delete(id);
  }
}
