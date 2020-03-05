import { LOBBY, ROOM, GAME } from '../constants/';
//import socket from '../socket';
import Leap from '../assets/leap';

const game = new Leap (4,8,0);

const initialState = {

};


function roomReducer (state = initialState, action) {
  switch (action.type) {
    case ROOM.ENTER:
      //socket.io.emit('roomAction', action);
      break;
    case ROOM.EXIT:

      break;

    case GAME.MOVE_READY:
      //selectcell logic in here... when submiting move, confirm on server
      break;

    case LOBBY.UPDATE:
      state = {...action.payload.rooms};
      break
    default: break;
  }
  return state;
}

export default roomReducer;
