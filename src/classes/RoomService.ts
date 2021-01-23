import { randomString } from '../functions/RandomString';
import { Server } from 'socket.io';
import { Room } from './Room';
import { SocketClient } from './SocketClient';

class RoomService {
  private rooms: Room[] = [];
  readonly io: Server;

  /**
   * Create a RoomService instance
   * @param io Injected socket.io instance
   */
  constructor(io: Server) {
    this.io = io;
  }

  /**
   * @description Add a room to the collection
   * @param name
   * @param host
   */
  public create(name: string, host: SocketClient): void {
    this.removeClientFromRooms(host);
    const room = this.rooms.find((r) => r.name === name);
    if (room) {
      throw new Error('A room with that name already exists');
    }
    this.rooms.push(new Room({ name, sha: randomString(6), io: this.io, host }));
  }

  public addClientByRoomName(pseudo: string, client: SocketClient, roomName: string): void {
    const room = this.rooms.find((r) => r.name === roomName);

    if (!room) {
      throw new Error(`No room with ${roomName} name can be found.`);
    }

    room.addClient(pseudo, client);
  }

  public addClientByRoomSha(pseudo: string, client: SocketClient, roomSha: string): void {
    const room = this.rooms.find((r) => r.sha === roomSha);

    if (!room) {
      throw new Error(`No room with ${roomSha} token can be found.`);
    }

    room.addClient(pseudo, client);
  }

  public removeClientFromRooms(client: SocketClient): void {
    this.rooms.forEach((room) => {
      room.removeClient(client);
    });
  }
}

export { RoomService };
