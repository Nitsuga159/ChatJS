import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class WsService {
  private connections: Map<string | Types.ObjectId, Socket> = new Map<
    string,
    Socket
  >();

  set(id: string | Types.ObjectId, socket: Socket): void {
    this.connections.set(id, socket);
  }

  getAll(): Socket[] {
    return [...this.connections.values()];
  }

  get(id: string | Types.ObjectId): Socket | null {
    return this.connections.get(id);
  }

  delete(id: string | Types.ObjectId): void {
    this.connections.delete(id);
  }
}
