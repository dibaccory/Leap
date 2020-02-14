import socket from 'socket.io';
import { EVENT, CONNECTION, DISCONNECT } from '../constants/eventTypes';
import { USER, ROOM, GAME, CHAT } from '../../shared/constants';

const emitToRoom = () => {};
const broadcastToRoom = () => {};
const emitToSocket = () => {};

function IO (server) {
  const io = socket(server);
  io.origins('*:*');
  const users = {};
  const rooms = {};
  io.on(CONNECTION, async socket => {
      socket
        .on(DISCONNECT, async () => { this.disconnect() })
        .on(EVENT.USER, async data => { this.userEvent(data) })
        .on(EVENT.ROOM, async data => { this.roomEvent(data) })
        .on(EVENT.GAME, async data => { this.gameEvent(data) })
        .on(EVENT.CHAT, async data => { this.chatEvent(data) });
  });

}
IO.prototype.disconnect () {

}
IO.prototype.userEvent (data) { //login, logout, updateUserInfo
  switch (data.action) {
    case USER.LOGIN:
      break;
    case USER.LOGOUT:
      break;
    case USER.UPDATE:
      break;
    default:
  }
}
IO.prototype.roomEvent (data) { //roomEnter, roomExit, roomAdd, roomDelete
  switch (data.action) {
    case ROOM.ENTER:
      break;
    case ROOM.EXIT:
      break;
    case ROOM.ADD:
      break;
    case ROOM.DELETE:
      break;
    default:
  }
}
IO.prototype.gameEvent (data) { //gameStart, gameMove, gameEnd
  switch (data.action) {
    case GAME.START:
      break;
    case GAME.MOVE:
      break;
    case GAME.END:
      break;
    default:
  }
}
IO.prototype.chatEvent (data) { //chatSend, chatTyping
  switch (data.action) {
    case CHAT.SEND:
      break;
    case CHAT.TYPING:
      break;
    default:
  }
}
