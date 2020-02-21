//import CHAT from '../constants/ChatTypes';


const initialState = {
  me: {},
  isLoggedIn: true,
  settings: {
    sfxVolume: 100,
    musicVolume: 100,
    display: undefined,
  },
  activeView: 'home',
};
function rootReducer (state = initialState, action) { return state;
  // switch (action.type) {
  //   default: return state;
  // }
}

export default rootReducer;
