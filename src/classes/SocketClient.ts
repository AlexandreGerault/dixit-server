import { EventTypes as ReceivedEventTypes } from '@/types/events/received/EventTypes';
import { ReceivedActions } from '@/types/events/received/ReceivedActions';
import { ConnectedToRoomEvent } from '@/types/events/sent/ConnectedToRoomEvent';
import { ErrorEvent } from '@/types/events/sent/ErrorEvent';
import { EventTypes as SentEventTypes } from '@/types/events/sent/EventTypes';
import { ActionCallback } from '@/types/sockets/ActionCallback';
import { Socket } from 'socket.io';
import { RoomService } from './RoomService';

/**
 * Represents a client.
 * The responsability of this class is to listent events and dispatch
 * them to action.
 *
 * @author Alexandre Gérault
 * @description Listen for client events and send data when needed.
 */
class SocketClient {
  public socket: Socket;
  readonly rs: RoomService;

  /**
   * Init event listeners for a SocketIO client
   * @param socket
   * @param rs
   */
  constructor(socket: Socket, rs: RoomService) {
    this.socket = socket;
    this.rs = rs;

    this.onEvent('joinRoom', this.onJoinRoom.bind(this));

    this.onEvent('createRoom', this.onCreateRoom.bind(this));

    this.onEvent('disconnect', () => {
      this.rs.removeClientFromRooms(this);
    });

    // this.onEvent('startGame', () => {
    //   console.log('Start game');
    // });

    // this.onEvent('playedCard', () => {
    //   console.log('Played card');
    // });

    // this.onEvent('playerVoted', () => {
    //   console.log('Player voted a card');
    // });
  }

  public onEvent(type: ReceivedEventTypes, callback: ActionCallback): void {
    this.socket.on(type, callback);
  }

  public send(type: SentEventTypes, payload: object): void {
    this.socket.emit(type, payload);
  }

  public sendError(payload: ErrorEvent) {
    this.socket.emit('error', payload);
  }

  private onJoinRoom(payload: ReceivedActions) {
    if (payload.action !== 'join') {
      throw new Error('The payload action is not **join**. Incorrect payload for joinRoom event.');
    }
    try {
      this.rs.addClientByRoomSha(payload.playerName, this, payload.sha);
    } catch (error) {
      const errorPayload: ErrorEvent = {
        name: 'JoinRoom',
        message: error.message,
      };
      this.sendError(errorPayload);
    }
  }

  private onCreateRoom(payload: ReceivedActions) {
    if (payload.action !== 'create') {
      throw new Error('The payload action is not **create**. Incorrect payload for createRoom event.');
    }

    try {
      this.rs.create(payload.roomName, this);
      this.rs.addClientByRoomName(payload.playerName, this, payload.roomName);
    } catch (error) {
      const errorPayload: ErrorEvent = {
        name: 'CreateRoom',
        message: error.message,
      };
      this.sendError(errorPayload);
    }
  }
}

export { SocketClient };
