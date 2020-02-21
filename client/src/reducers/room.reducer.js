import ROOM from '../constants/room.types';
/*
props:
  me: {
    id: HASH
    name: string
    icon: yee
  }
*/
const initialState = {
  'aaa': {
    game: {},
    users: ['userA'],
    host: ['userA'],
    chat: {},
  },
  
};


function roomReducer (state = initialState, action) {
  const { game, move } = state;
  switch (action.type) {
    case ROOM.ENTER:

      break;
    case ROOM.MOVE_READY:
      //selectcell logic in here... when submiting move, confirm on server
      break;
    default: return state;
  }
}

export default roomReducer;
