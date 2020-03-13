import socketIOClient from 'socket.io-client';
//import store from '../store/';
import { ENDPOINT } from './constants';
import { USER, LOBBY, ROOM, GAME, CHAT } from '../constants';
//import ACTION from './actions';


const socketMiddleware = () => {
  let io = null;

  const onConnect = store => event => {
    console.log('Howdy!');
  };

  const onDisconnect = store => event => {
    console.log('Bowdy?');
  };

  const onMessage = dispatch => action => {
    //TODO: I guess this is where we handle the server data
    console.log('onMessage: %o' , action);
    switch (action.type) {
      case USER.LOGIN:
        dispatch({type: USER.LOGIN, payload: action.payload.me});
        dispatch({type: ROOM.FETCH_ROOMS, payload: action.payload.rooms});
        dispatch({type: LOBBY.UPDATE, payload: action.payload.rooms});
        break;

      case ROOM.ENTER:
        dispatch({type: ROOM.FETCH_ROOMS, payload: action.payload.rooms});
        break;

      case ROOM.UPDATE_GAME:
        dispatch(action);
        break;
      default: break;
    }
  };

  return dispatch => action => {
    switch (action.type) {
      case 'connect':
        if (io) break;

        io = socketIOClient(action.host);
        io
          .on('connect', onConnect(dispatch))
          .on('message', onMessage(dispatch))
          .on('disconnect', onDisconnect(dispatch));
        break;

      case 'disconnect':
        if (io) io.close();
        io = null;
        console.log('Disconnected.');
        break;

      case ROOM.ENTER:
      case ROOM.EXIT:
      case ROOM.SUBMIT_MOVE:
      case ROOM.END_GAME:
        io.emit('roomEvent', action);
        break;

      case GAME.START:
      case GAME.SELECT:
      case GAME.END:
        io.emit('gameEvent', action);
        break;


      default:
      return dispatch(action);
    }
  };
};

export default socketMiddleware;
