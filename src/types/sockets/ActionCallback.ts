import { ReceivedActions } from '../events/received/ReceivedActions';

type ActionCallback = (payload: ReceivedActions) => void;

export type { ActionCallback };
