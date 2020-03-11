import ROOM from '../constants/room.types';

export const enter = payload => ({type: ROOM.ENTER, payload});
export const submitMove = payload => ({type: ROOM.SUBMIT_MOVE, payload});
export const endGame = payload => ({type: ROOM.END_GAME, payload});
export const exit = payload => ({type: ROOM.EXIT, payload});

export default {
  enter,
  submitMove,
  endGame,
  exit
};
