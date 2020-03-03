import {LOBBY} from '../constants/lobby.types';

const initialState = {
    'home': {
      rooms: ['room1'], //room ids contained here
      activeRoom: 0,
    },
    'browse': {
      rooms: ['room2'],
      activeRoom: 0,
    },
};

function lobbyReducer (state = initialState, action) {
  switch (action.type) {
    case LOBBY.ADD_ROOM:
      break;
    case LOBBY.REMOVE_ROOM:
      break;
    case LOBBY.UPDATE:
      break;
    case LOBBY.TOGGLE_SCROLL:
      break;
    default:
      return state;
  }
}

export default lobbyReducer;