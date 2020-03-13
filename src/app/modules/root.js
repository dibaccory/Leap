//import CHAT from '../constants/ChatTypes';
import { USER, GAME, ROOM } from './constants';

const initialState = {
  me: {
    id: '',
    name: '',
  },
  isLoggedIn: false,
  settings: {
    sfxVolume: 100,
    musicVolume: 100,
    display: undefined,
  },
  activeView: 'Browse',
  cachedGame: {
    room: undefined,
    move: {to: undefined, from: undefined, captured: undefined},
    isMoveReadyToSubmit: false,
  }
};
function rootReducer (state = initialState, action) {
  switch (action.type) {
    case USER.LOGIN:
      console.log('USER LOGIN: ' + JSON.stringify(action.payload));
      state = {...state, me: {...action.payload}, isLoggedIn: true};
      break;
    case USER.LOGOUT:
      state = {...state, me: {...action.payload}, isLoggedIn: false};
      break;

    case GAME.MOVE_READY:
      state.cachedGame.isMoveReadyToSubmit = true;

    case ROOM.SUBMIT_MOVE:
      state.cachedGame.isMoveReadyToSubmit = false;

    default: break;
  }
  return state;
}

export default rootReducer;
