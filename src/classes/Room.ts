import { EventTypes as SentEventTypes } from '@/types/events/sent/EventTypes';
import { randomInList } from '../functions/RandomInList';
import { Server } from 'socket.io';
import { Game } from './Game';
import { SocketClient } from './SocketClient';
import { Player } from './Player';
import { Player as PlayerType } from '@/types/game/Player';

type RoomConstructorType = {
  name: string;
  sha: string;
  io: Server;
  host: SocketClient;
};

class Room {
  public name: string;
  readonly sha: string;
  public clients: { pseudo: string; client: SocketClient }[];
  public io: Server;
  private game: Game;
  private host: SocketClient;

  constructor({ name, sha, io, host }: RoomConstructorType) {
    this.name = name;
    this.sha = sha;
    this.clients = [];
    this.io = io;
    this.host = host;

    this.game = new Game();

    console.log(this.sha);
  }

  /**
   * Add a client to the room
   *
   * @param pseudo
   * @param client
   */
  public addClient(pseudo: string, client: SocketClient): void {
    if (this.clients.find((c) => c.pseudo === pseudo)) {
      throw new Error('A player with that name is already in the room.');
    }

    client.socket.join(this.sha);
    client.send('onConnect', { players: this.toSerializedPlayer(), host: this.host === client });
    this.clients.push({ pseudo, client });
    this.broadcast('joinRoom', { players: this.toSerializedPlayer() });

    client.onEvent('startGame', (): void => {
      if (this.game.state !== 'lobby') {
        client.sendError({
          name: 'GIP',
          message: 'Cannot start a game that is already in progress',
        });
      } else if (this.clients.length < 2) {
        client.sendError({
          name: 'NP',
          message: 'There is too few players',
        });
      } else {
        this.game.start(this);
      }
    });
  }

  public removeClient(client: SocketClient): void {
    client.socket.leave(this.sha);
    this.clients = this.clients.filter((sc) => sc.client !== client);
    if (!this.host) {
      this.onHostLeave();
    }
    this.broadcast('leaveRoom', { players: this.toSerializedPlayer() });
  }

  public onHostLeave(): void {
    this.host = randomInList(this.clients);
  }

  public broadcast(type: SentEventTypes, payload: object): void {
    this.io.to(this.sha).emit(type, payload);
  }

  private toSerializedPlayer(): PlayerType[] {
    return this.clients.map(
      (c): PlayerType => {
        return {
          pseudo: c.pseudo,
          score: 0,
          status: undefined,
          master: false,
        };
      }
    );
  }
}

export { Room };
