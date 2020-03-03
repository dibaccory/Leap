//import CHAT from '../constants/ChatTypes';
import { USER } from '../constants/';
import socket from '../socket';

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
  activeView: 'home',
  cachedGame: {
    room: undefined,
    move: {to: undefined, from: undefined, captured: undefined},
    isMoveReadyToSubmit: false,
  }
};
function rootReducer (state = initialState, action) {
  switch (action.type) {
    case USER.LOGIN:
      console.log('aw shit, here we go again');
      socket.io.emit('userEvent', action);
      return {...state, ...action.payload, isLoggedIn: true};
    default: break;
  }
  return state;
}

export default rootReducer;
