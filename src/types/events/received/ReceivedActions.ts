import { CreateRoomAction } from './CreateRoomAction';
import { JoinRoomAction } from './JoinRoomAction';
import { PlayCardAction } from './PlayCardAction';
import { VoteAction } from './VoteAction';

type ReceivedActions = CreateRoomAction | JoinRoomAction | PlayCardAction | VoteAction;

export { ReceivedActions };
