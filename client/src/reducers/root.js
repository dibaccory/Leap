//import CHAT from '../constants/ChatTypes';
import { USER } from '../constants/';

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
      console.log('user login: ' + JSON.stringify(action.payload));
      state = {...state, me: {...action.payload}, isLoggedIn: true};
      break;
    case USER.LOGOUT:
      state = {...state, me: {...action.payload}, isLoggedIn: false};
      break;
    default: break;
  }
  return state;
}

export default rootReducer;
