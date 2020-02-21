import ROOM from '../constants/room.types';
import gameReducer from './game.reducer';
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

      break;
    case ROOM.MOVE_READY:
      //selectcell logic in here... when submiting move, confirm on server
      break;
    default: return state;
  }
}

export default roomReducer;
