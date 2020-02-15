import CHAT from '../constants/ChatTypes';
const initialState = {
  base: {},
};

/* APP INITIAL STATE
this.state = {
  user: {},
  settings: {
    musicVolume: 100,
    sfxVolume: 100,
    notificationBadges: true,
  },
  activeView: 'Home',
};
*/
function rootReducer (state = initialState, action) {
  switch (action.type) {
    case USER.LOGIN: {

    }
    case USER.LOGOUT: {

    }
    case USER.UPDATE_PROFILE: {

    }
    case ROOM.ENTER: {

    }
    case ROOM.EXIT: {

    }
    case GAME.START: {

    }
    case GAME.MOVE: {

    }
    case GAME.END: {

    }
    case CHAT.SEND_MSG: {

    }
    case CHAT.TYPING: {

    }
    default: return state;
  }
}

export default rootReducer;
