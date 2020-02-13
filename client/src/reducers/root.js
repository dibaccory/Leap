const initialState = {
  base: {},
};

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN: {

    }
    case USER_LOGOUT: {

    }
    case USER_PROFILE_UPDATE: {

    }
    case ROOM_ENTER: {

    }
    case ROOM_EXIT: {

    }
    case GAME_START: {

    }
    case GAME_MOVE: {

    }
    case GAME_END: {

    }
    case CHAT_SEND_MSG: {

    }
    case CHAT_TYPING: {
      
    }
    default: return state;
  }
}

export default rootReducer;
