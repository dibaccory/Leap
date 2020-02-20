import { combineReducers } from 'redux';
import rootReducer from './root';
import lobbyReducer from './lobby.reducer';
import roomReducer from './room.reducer';
import gameReducer from '.game.reducer';

const initialState = {
  me: {},
  isLoggedIn: true,
  settings: {
    sfxVolume: 100,
    musicVolume: 100,
    display: undefined,
  },
  views: {
    'home': {
      rooms: ['aaa'], //room ids contained here
      activeRoomID: 0,
    },
    'browse': {
      rooms: ['aaa'],
      activeRoomID: 0,
    },
    'leaderboard': {

    }
  },
  activeView: 'home',
  rooms: {
    'aaa': {
      game: {},
      users: ['userA'],
      host: ['userA'],
      chat: {},
    },
  },
  users: {
    'userA': {},
  }
};

const reducer = combineReducers({
  root: rootReducer,
  lobby: lobbyReducer,
  room: roomReducer,
});

export default reducer;
