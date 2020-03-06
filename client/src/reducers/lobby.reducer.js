import {LOBBY} from '../constants/lobby.types';
/*
Home lobby: games user is currently allowed to be in (ongoing games, etc.)
*/
const initialState = {
    'Home': {
      rooms: ['room1'], //room ids contained here
      activeRoom: 0,
    },
    'Browse': {
      rooms: ['room2'],
      activeRoom: 0,
    },
};

function lobbyReducer (state = initialState, action) {
  switch (action.type) {
    case LOBBY.ADD_ROOM:
      //socket.io.emit('eventLobby', action);
      break;
    case LOBBY.REMOVE_ROOM:
      break;
    case LOBBY.UPDATE:
      console.log(action.payload);
      state['Browse'].rooms = Object.keys(action.payload);
      break;
    case LOBBY.TOGGLE_SCROLL:
      break;
    default:
      break;
  }
  return state;
}

export default lobbyReducer;
