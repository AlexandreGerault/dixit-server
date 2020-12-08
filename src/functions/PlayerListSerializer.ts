import { Player as PlayerType } from '@/types/game/Player';
import { Player } from 'classes/Player';
import { serializePlayer } from './PlayerSerializer';

const serializePlayersList = (players: Player[]): PlayerType[] => players.map((p) => serializePlayer(p));

export { serializePlayersList };
