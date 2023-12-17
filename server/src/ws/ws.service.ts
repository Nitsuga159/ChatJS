import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class WsService {
  private connections: Map<string, Socket> = new Map<string, Socket>();

  set(id: Types.ObjectId, socket: Socket): void {
    this.connections.set(id.toString(), socket);
  }

  get(id: Types.ObjectId): Socket | null {
    return this.connections.get(id.toString());
  }

  getKeys(): string[] {
    return [...this.connections.keys()];
  }

  delete(id: Types.ObjectId): Socket | null {
    if (this.connections.has(id.toString())) {
      const socket = this.connections.get(id.toString());
      this.connections.delete(id.toString());
      return socket;
    }

    return null;
  }

  has(id: Types.ObjectId): boolean {
    return this.connections.has(id.toString());
  }
}
