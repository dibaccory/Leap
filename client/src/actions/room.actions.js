import ROOM from '../constants/room.types';

export const enter = payload => dispatch => dispatch({type: ROOM.ENTER, payload});
export const submitMove = payload => dispatch => dispatch({type: ROOM.SUBMIT_MOVE, payload});
export const endGame = payload => dispatch => dispatch({type: ROOM.END_GAME, payload});
export const exit = payload => dispatch => dispatch({type: ROOM.EXIT, payload});

export default {
  enter,
  submitMove,
  endGame,
  exit
};
