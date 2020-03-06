import socket from 'socket.io';
import Leap from '../assets/leap';
import { EVENT, CONNECTION, DISCONNECT } from '../constants/eventTypes';
import { USER, LOBBY, ROOM, GAME, CHAT } from '../constants/';



const onlineUsers = {};
const rooms = {
  'room1': {
    game: new Leap (4,8,0),
    whitelist: false,
    users: ['user1'],
    host: 'user1',
    playerOne: '',
    playerTwo: '',

  },
  'room2': {
    game: new Leap (4,8,0),
    whitelist: false,
    users: ['user2'],
    host: 'user2',
  },
};
var client;

var io;

const emitToRoom = (action) => { io.emit('message', action) };
const broadcastToRoom = () => {};
const emitToSocket = () => {};

async function IO (server) {
  io = socket(server);
  io.origins('*:*');
  io.on(CONNECTION, async socket => {
    //io.emit('connect');
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
  console.log('USER EVENT')
  switch (action.type) {
    case USER.LOGIN:
      console.log(action.payload);
      onlineUsers[action.payload.me.id] = action.payload.me;
      client = action.payload.me.id;
      console.log(`${action.payload.me.name} joined!`);
      console.log('send rooms over');
      io.emit('message', {type: USER.LOGIN, payload: {rooms: rooms, me: action.payload.me}});
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
    console.log('LOBBY EVENT')
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

const roomEvent = (action) => {
    console.log('ROOM EVENT')

  switch (action.type) {
    case ROOM.ENTER:
    console.log(JSON.stringify(action));
    console.log(`${action.payload.me.name} entered Room ${action.payload.roomID}`);
      rooms[action.payload.roomID].users.push(action.payload.me.id);
      break;
    case ROOM.EXIT:
      break;
    case ROOM.SUBMIT_MOVE:
      //TODO: verify board state first
      //let { roomID, game, move } = action.payload;
      /*
      CHECKS:
        is move valid?
        is rooms[roomID].game === game?
      */
      const isWin = rooms[action.payload.roomID].game.doMove(action.payload.move);
      action.type = ROOM.UPDATE_GAME;
      emitToRoom(action);

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
