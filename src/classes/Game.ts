import { serializePlayersList } from '@/functions/PlayerListSerializer';
import { GameStep } from '@/types/game/GameStep';
import { Player } from './Player';
import { Room } from './Room';

class Game {
  public state: GameStep = 'lobby';
  private players: Player[] = [];

  public start(room: Room): void {
    room.clients.forEach((c) => {
      this.players = [];
      this.players.push(new Player(c.pseudo));
    });
    room.broadcast('gameStarted', { players: serializePlayersList(this.players) });
    this.state = 'pick';
  }
}

export { Game };
