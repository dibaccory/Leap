import socketIOClient from 'socket.io-client';
import store from './store/';
import { ENDPOINT } from './constants/socket.types';
import { USER, LOBBY, ROOM, GAME, CHAT } from './constants/';
import ACTION from './actions';


const socketMiddleware = () => {
  let socket;

  const onConnect = store => event => {
    console.log('Howdy!');
  };

  const onDisconnect = store => event => {
    console.log('Bowdy?');
  };

  const onMessage = store => event => {
    //TODO: I guess this is where we handle the server data
  };

  return store => next => action => {
    switch (action.type) {
      case 'CONNECT':
        if (socket) socket.close();

        socket = socket(action.server);
        socket
          .on('connect', onConnect(store))
          .on('message', onMessage(store))
          .on('disconnect', onDisonnect(store));
        break;

      case 'DISCONNECT':
        if (socket) socket.close();
        socket = null;
        console.log('Disconnected.');
        break;

      case USER.LOGIN:
      case USER.LOGOUT:
        socket.emit('eventUser', action);
        break;

      case LOBBY.ADD_ROOM:
      case LOBBY.REMOVE_ROOM:
      case LOBBY.UPDATE:
        socket.emit('eventLobby', action);
        break;

      case ROOM.ENTER:
      case ROOM.EXIT:
      case ROOM.SUBMIT_MOVE:
      case ROOM.END_GAME:
        socket.emit('eventRoom', action);
        break;

      case GAME.START:
      case GAME.SELECT:
      case GAME.END:
        socket.emit('eventGame', action);
        break;


      default:
      return next(action);
    }
  };
}

// function Socket () {
//   this.io = socketIOClient.connect('ws://localhost:3001');
//
//   this.io
//     .on('connect', () => console.log('howdy'))
//     .on(LOBBY.UPDATE, (data) => store.dispatch(ACTION.LOBBY.update(data)))
//     .on(LOBBY.ADD_ROOM, (data) => store.dispatch(ACTION.LOBBY.update(data)))
//     .on('recieveMove', data => {
//       console.log(data);
//     });
// }
//
// const socket = new Socket();

export default socketMiddleware;
