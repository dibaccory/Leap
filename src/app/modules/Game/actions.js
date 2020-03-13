import { GAME } from './constants';

export const start = payload => ({type: GAME.START, payload});
export const select = payload => ({type: GAME.SELECT, payload});
export const cacheMove = payload => ({type: GAME.CACHE_MOVE, payload});
export const moveReady = payload => ({type: GAME.MOVE_READY, payload});
export const end = payload => ({type: GAME.END, payload});


export default {
  start,
  select,
  moveReady,
  end,
};
