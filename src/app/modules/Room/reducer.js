import { ROOM } from './constants';
//import socket from '../socket';
const initialState = {

};


export function roomReducer (state = initialState, action) {
  switch (action.type) {
    case ROOM.ENTER:
      //socket.io.emit('roomAction', action);
      break;
    case ROOM.EXIT:

      break;

    case ROOM.FETCH_ROOMS:
      console.log('fetch rooms: %o', action);
      state = {...action.payload};
      break;

    case ROOM.UPDATE_GAME:
      state.game = action.payload;
      break;

    default: break;
  }
  return state;
}

export default roomReducer;
