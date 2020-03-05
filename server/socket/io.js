import socket from 'socket.io';
import Leap from '../assets/leap';
const game = new Leap (4,8,0);
import { EVENT, CONNECTION, DISCONNECT } from '../constants/eventTypes';
import { USER, LOBBY, ROOM, GAME, CHAT } from '../constants/';

const emitToRoom = () => {};
const broadcastToRoom = () => {};
const emitToSocket = () => {};

const onlineUsers = {};
const rooms = {
  'room1': {
    game: game,
    whitelist: false,
    users: ['user1'],
    host: 'user1',
  },
  'room2': {
    game: game,
    whitelist: false,
    users: ['user2'],
    host: 'user2',
  },
};
var client;

var io;

async function IO (server) {
  io = socket(server);
  io.origins('*:*');
  io.on(CONNECTION, async socket => {
      socket
        .on(DISCONNECT, () => { disconnect() })
        .on(EVENT.USER, data => { userEvent(data) })
        .on(EVENT.LOBBY, data => { roomEvent(data) })
        .on(EVENT.ROOM, data => { roomEvent(data) })
        .on(EVENT.GAME, data => { gameEvent(data) })
        .on(EVENT.CHAT, data => { chatEvent(data) });
  });

  return io;
}

const disconnect = () => {
  delete onlineUsers[client];
  console.log(JSON.stringify(onlineUsers));
}
const userEvent = action => { //login, logout, updateUserInfo
  switch (action.type) {
    case USER.LOGIN:
      console.log(action.payload);
      onlineUsers[action.payload.me.id] = action.payload.me;
      client = action.payload.me.id;
      console.log(`${action.payload.me.name} joined!`);
      console.log('send rooms over');
      io.emit('message', {type: LOBBY.UPDATE, data: rooms});
      break;
    case USER.LOGOUT:
      client = ''; //go back to session ID
      break;
    case USER.UPDATE:
      break;
    default:
      break;
  }
}

const lobbyEvent = action => {
  switch (action.type) {
    case LOBBY.ADD_ROOM:
      rooms[action.payload.id] = action.payload.room;

      io.emit(LOBBY.ADD_ROOM, {
        type: LOBBY.ADD_ROOM,
        payload: { rooms }
        });

      break;
    case LOBBY.REMOVE_ROOM:
      delete rooms[action.payload.id];
      break;
    case LOBBY.UPDATE:
      break;
    case ROOM.DELETE:
      break;
    default:
  }
}

const roomEvent = (action) => { //roomEnter, roomExit, roomAdd, roomDelete
  switch (action.type) {
    case ROOM.ENTER:
      const { me, roomID } = action.payload;
      room[roomID].users.push(me.id);
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

const gameEvent = (data) => { //gameStart, gameMove, gameEnd
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
const chatEvent = (data) => { //chatSend, chatTyping
  switch (data.action) {
    case CHAT.SEND:
      break;
    case CHAT.TYPING:
      break;
    default:
  }
}

export default IO;
