import socket from 'socket.io';
import Leap from '../assets/leap';
import { EVENT, CONNECTION, DISCONNECT } from '../constants/eventTypes';
import { USER, LOBBY, ROOM, GAME, CHAT } from '../../common/constants/';


const onlineUsers = {};
const rooms = {
  'room1': {
    game: new Leap (4,8,0),
    whitelist: false,
    users: [],
    host: 'user1',
    player: {
      one: '',
      two: '',
    }

  },
  'room2': {
    game: new Leap (4,8,0),
    whitelist: false,
    users: [],
    host: 'user2',
    player: {
      one: '',
      two: '',
    }
  },
};
var client;

var io;

const emitToRoom = (action) => { io.emit('message', action) };
const broadcastToRoom = () => {};
const emitToSocket = () => {};

const setPlayer = (room, uid) => {
  if (room.player.one === room.player.two) {
    if (room.game.turn === 4) room.player.one = uid;
    else room.player.two = uid;
  } else if (room.player.one) room.player.two = uid;
  else room.player.one = uid;

  console.log(`${client} is now player ${room.player.one === uid ? 'one' : 'two' }`);
}

async function IO (server) {
  io = socket(server);
  io.origins('*:*');
  io.on(CONNECTION, async socket => {
    //io.emit('connect');
      socket
        .on(DISCONNECT, () => { disconnect() })
        .on(EVENT.USER, data => { userEvent(socket, data) })
        .on(EVENT.LOBBY, data => { roomEvent(data) })
        .on(EVENT.ROOM, data => { roomEvent(socket, data) })
        .on(EVENT.GAME, data => { gameEvent(data) })
        .on(EVENT.CHAT, data => { chatEvent(data) });
  });

  return io;
}

const disconnect = () => {
  delete onlineUsers[client];
  console.log(JSON.stringify(onlineUsers));
}
const userEvent = (socket, action) => { //login, logout, updateUserInfo
  console.log(`USER EVENT: ${action.type}`);
  switch (action.type) {
    case USER.LOGIN:
      console.log(action.payload);
      onlineUsers[action.payload.me.id] = action.payload.me;
      client = action.payload.me.id;
      console.log(`${action.payload.me.name} joined!`);
      console.log('send rooms over');
      io.to(socket.id).emit('message', {type: USER.LOGIN, payload: {rooms: rooms, me: action.payload.me}});
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

const roomEvent = (socket, action) => {
    console.log('ROOM EVENT')
    console.log(JSON.stringify(action));
  switch (action.type) {
    case ROOM.ENTER:
      const me = action.payload.me;
      const roomID = action.payload.roomID;
      const activeRoom = rooms[roomID];
      rooms[roomID].users.push(me.id);
      console.log(`${me.name} entered Room ${roomID}`);

      if(!(rooms[roomID].player.one && rooms[roomID].player.two)) setPlayer(rooms[roomID], me.id);
      console.log(`player deets: ${JSON.stringify(rooms[roomID].player)}`)
      io.to(socket.id).emit('message', {type: ROOM.ENTER, payload: {rooms:rooms}});


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
