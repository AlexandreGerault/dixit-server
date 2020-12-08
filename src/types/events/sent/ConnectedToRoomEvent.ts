import { Player } from '@/types/game/Player';

type ConnectedToRoomEvent = {
  players: Player[];
  host: boolean;
};

export type { ConnectedToRoomEvent };
