import GAME from '../constants/game.types';

const initialState = {
  board: {},
  move: {to: undefined, from: undefined, captured: undefined},
};
function gameReducer (state = initialState, action) {
  const { game, move } = state;
  switch (action.type) {
    case GAME.START:

      break;
    case GAME.SELECT:
      break;
    default: return state;
  }
}


export default gameReducer;
