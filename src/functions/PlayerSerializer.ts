import { Player as PlayerType } from '@/types/game/Player';
import { Player } from 'classes/Player';

const serializePlayer = (player: Player): PlayerType => ({
  name: player.pseudo,
  status: player.status,
  score: player.score,
  master: false,
});

export { serializePlayer };
