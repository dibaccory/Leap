import {LOBBY} from '../constants/lobby.types';
import mongoose from 'mongoose';
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
      activeRoom: 'room2',
    },
};

function lobbyReducer (state = initialState, action) {
  console.log('Lobby reducer');
  switch (action.type) {
    case LOBBY.ADD_ROOM:
      console.log('ADD ROOM');

      break;
    case LOBBY.REMOVE_ROOM:
      break;
    case LOBBY.UPDATE:
      console.log('UPDATE: ' +  Object.keys(action.payload));
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
