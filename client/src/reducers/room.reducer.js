import ROOM from '../constants/room.types';
import GAME from '../constants/game.types';
//import socket from '../socket';
import Leap from '../assets/leap';

const game = new Leap (4,8,0);

const initialState = {
  'room1': {
    game: game,
    users: ['user1'],
    host: ['user1'],
    chat: {},
  },
  'room2': {
    game: game,
    users: ['user2'],
    host: ['user2'],
    chat: {},
  },

};


function roomReducer (state = initialState, action) {
  const { game, move } = state;
  switch (action.type) {
    case ROOM.ENTER:
      //socket.io.emit('roomAction', action);
      break;
    case ROOM.EXIT:

      break;

    case GAME.MOVE_READY:
      //selectcell logic in here... when submiting move, confirm on server
      break;
    default: return state;
  }
}

export default roomReducer;
