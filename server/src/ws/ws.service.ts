import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class WsService {
  private connections: Map<Types.ObjectId, Socket[]> = new Map<
    Types.ObjectId,
    Socket[]
  >();

  set(id: Types.ObjectId, socket: Socket): void {
    const sockets: Socket[] | null = this.connections.get(id);

    if (!sockets) this.connections.set(id, [socket]);
    else sockets.push(socket);
  }

  get(id: Types.ObjectId): Socket[] | null {
    return this.connections.get(id);
  }

  getKeys(): Types.ObjectId[] {
    return [...this.connections.keys()];
  }

  delete(id: Types.ObjectId, socketId: string): Socket | null {
    const sockets: Socket[] = this.connections.get(id) || [];

    const index = sockets.findIndex((socket: Socket) => socket.id === socketId);

    if (index > -1) return sockets.splice(index, 1)[0];

    return null;
  }
}
